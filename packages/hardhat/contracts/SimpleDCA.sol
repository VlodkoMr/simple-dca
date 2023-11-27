//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "hardhat/console.sol";
import "./interface/IVault.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./helpers/utils.sol";

contract SimpleDCA is AutomationCompatibleInterface, Ownable, Utils {
    using SafeERC20 for IERC20;
    IVault public balancerVault;

    uint16 constant STRATEGY_FEE_PCT = 5; // 0.5%
    uint16 constant DENOMINATOR = 1000;
    uint32 public totalStrategies;
    address public feeCollector;

    mapping(uint32 => Strategy) public strategies;
    mapping(uint32 => address[]) public strategyUsers;

    mapping(address => mapping(uint32 => UserStrategyDetails)) public userStrategyDetails;
    mapping(address => uint32[]) public userStrategies;

    struct Strategy {
        address fromAsset;
        address toAsset;
        bytes32 balancerPoolId;
        uint256 totalAmountFromAsset;
        uint256 totalAmountToAsset;
//        uint256 lastExecuted;
        uint32 usersCount;
        uint32 usersLimit;
    }

    struct UserStrategyDetails {
        uint256 amountLeft;
        uint256 amountOnce;
        uint256 nextExecute;
        uint256 executeRepeat;
////        uint256 totalAmountFromAsset;
////        uint256 totalAmountToAsset;
        bool active;
    }

    modifier userStrategyExists(uint32 _strategyId) {
        if (userStrategyDetails[msg.sender][_strategyId].nextExecute == 0) {
            revert("SimpleDCA: user strategy does not exist");
        }
        _;
    }

    modifier strategyExists(uint32 _strategyId) {
        if (strategies[_strategyId].balancerPoolId == bytes32(0)) {
            revert("SimpleDCA: strategy does not exist");
        }
        _;
    }

    constructor(address _initialOwner, address _balancerVault, address _feeCollector)
    Ownable(_initialOwner)
    {
        balancerVault = IVault(_balancerVault);
        feeCollector = _feeCollector;
    }

    function activate(uint32 _strategyId, uint256 _executeRepeat, uint256 _amountOnce)
    public
    strategyExists(_strategyId)
    {
        require(_executeRepeat > 0, "SimpleDCA: executeRepeat must be greater than 0");

        if (userStrategyDetails[msg.sender][_strategyId].nextExecute == 0) {
            userStrategyDetails[msg.sender][_strategyId] = UserStrategyDetails({
                amountLeft: 0,
                amountOnce: _amountOnce,
                nextExecute: block.timestamp + _executeRepeat,
                executeRepeat: _executeRepeat,
                active: true
            });
            userStrategies[msg.sender].push(_strategyId);
        }

        _activateUserStrategy(_strategyId, msg.sender);
    }

    function deactivate(uint32 _strategyId)
    public
    strategyExists(_strategyId)
    userStrategyExists(_strategyId)
    {
        _deactivateUserStrategy(_strategyId, msg.sender);
    }

    function deposit(uint256 _amount, uint32 _strategyId)
    public
    strategyExists(_strategyId)
    userStrategyExists(_strategyId)
    {
        require(_amount > 0, "SimpleDCA: amount must be greater than 0");

        IERC20 token = IERC20(strategies[_strategyId].fromAsset);
        SafeERC20.safeTransferFrom(token, address(msg.sender), address(this), _amount);

        userStrategyDetails[msg.sender][_strategyId].amountLeft += _amount;
//        _activateUserStrategy(_strategyId, msg.sender);
    }


    function checkUpkeep(
        bytes calldata checkData
    )
    external
    view
    override
    returns (bool, bytes memory)
    {
        (uint32 _strategyId, uint32 _fromIndex, uint32 _toIndex) = abi.decode(
            checkData,
            (uint32, uint32, uint32)
        );

        if (strategies[_strategyId].usersCount <= _fromIndex) {
            return (false, "");
        }
        if (strategies[_strategyId].usersCount < _toIndex) {
            _toIndex = strategies[_strategyId].usersCount;
        }

        // get number of elements
        uint32 counter;
        for (uint32 i = 0; i < _toIndex - _fromIndex + 1; i++) {
            address _user = strategyUsers[_strategyId][_fromIndex + i];
            if (userStrategyDetails[_user][_strategyId].nextExecute <= block.timestamp) {
                counter++;
            }
        }

        bool _upkeepNeeded = false;
        uint256 _indexCounter;
        address[] memory _users = new address[](counter);
        uint256[] memory _txAmount = new uint256[](counter);

        for (uint256 i = 0; i < _toIndex - _fromIndex + 1; i++) {
            address _user = strategyUsers[_strategyId][_fromIndex + i];
            if (userStrategyDetails[_user][_strategyId].nextExecute <= block.timestamp) {
                _upkeepNeeded = true;
                _users[_indexCounter] = _user;
                if (userStrategyDetails[_user][_strategyId].amountLeft >= userStrategyDetails[_user][_strategyId].amountOnce) {
                    _txAmount[_indexCounter] = userStrategyDetails[_user][_strategyId].amountOnce;
                }

                _indexCounter++;
            }
        }

        bytes memory _performData = abi.encode(_strategyId, _users, _txAmount);
        return (_upkeepNeeded, _performData);
    }

    function performUpkeep(bytes calldata _performData)
    external override
    {
        (uint32 _strategyId, address[] memory _users, uint256[] memory _txAmount) = abi.decode(
            _performData,
            (uint32, address[], uint256[])
        );

        uint256 _totalSwap = 0;
        Strategy storage strategy = strategies[_strategyId];

        for (uint32 _i = 0; _i < _users.length; _i++) {
            if (_txAmount[_i] > 0) {
                _totalSwap += _txAmount[_i];
            }
        }
        IERC20(strategy.fromAsset).approve(address(balancerVault), _totalSwap);

        for (uint32 _i = 0; _i < _users.length; _i++) {
            if (_txAmount[_i] > 0) {
                _totalSwap += _txAmount[_i];
                userStrategyDetails[_users[_i]][_strategyId].amountLeft -= _txAmount[_i];
                userStrategyDetails[_users[_i]][_strategyId].nextExecute += userStrategyDetails[_users[_i]][_strategyId].executeRepeat;

                uint256 _result = swap(
                    strategy.fromAsset,
                    strategy.toAsset,
                    strategy.balancerPoolId,
                    _txAmount[_i],
                    _users[_i]
                );
                strategy.totalAmountFromAsset += _txAmount[_i];
                strategy.totalAmountToAsset += _result;

            } else {
                // deactivate user strategy
                _deactivateUserStrategy(_strategyId, _users[_i]);
            }
        }
    }

    // ---------------------- Private ----------------------

    function swap(
        address _fromAsset,
        address _toAsset,
        bytes32 _balancerPoolId,
        uint256 _amount,
        address _recipient
    )
    private
    returns (uint256)
    {
        SingleSwap memory _singleSwap = SingleSwap({
            poolId: _balancerPoolId,
            kind: SwapKind.GIVEN_IN,
            assetIn: _fromAsset,
            assetOut: _toAsset,
            amount: _amount,
            userData: bytes("")
        });
        FundManagement memory _funds = FundManagement({
            sender: address(this),
            fromInternalBalance: false,
            recipient: payable(_recipient),
            toInternalBalance: false
        });

        return balancerVault.swap(
            _singleSwap,
            _funds,
            _amount,
            block.timestamp + 1
        );
    }

    function _activateUserStrategy(uint32 _strategyId, address _userId) private {
        userStrategyDetails[_userId][_strategyId].active = true;
        (, bool _exists) = Utils.indexOf(strategyUsers[_strategyId], _userId);
        if (!_exists) {
            strategyUsers[_strategyId].push(_userId);
        }
    }

    function _deactivateUserStrategy(uint32 _strategyId, address _userId) private {
        userStrategyDetails[_userId][_strategyId].active = false;
        (uint _index, bool _exists) = Utils.indexOf(strategyUsers[_strategyId], _userId);
        if (_exists) {
            strategyUsers[_strategyId][_index] = strategyUsers[_strategyId][strategyUsers[_strategyId].length - 1];
            strategyUsers[_strategyId].pop();
        }
    }

//    function swap() public {
//        uint256 _amount = 1000000;
//        token = IERC20(0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb);
//        token.approve(address(balancerVault), _amount);
//
//        SingleSwap memory _singleSwap = SingleSwap({
//            poolId: 0x9ee0af1ee0a0782daf5f1af47fd49b2a766bd8d40001000000000000000004b9,
//            kind: SwapKind.GIVEN_IN,
//            assetIn: 0xe0C9275E44Ea80eF17579d33c55136b7DA269aEb,
//            assetOut: 0x0000000000000000000000000000000000000000,
//            amount: _amount,
//            userData: bytes("")
//        });
//        FundManagement memory _funds = FundManagement({
//            sender: address(this),
//            fromInternalBalance: false,
//            recipient: payable(msg.sender),
//            toInternalBalance: false
//        });
//
//        balancerVault.swap(
//            _singleSwap,
//            _funds,
//            1000000,
//            block.timestamp + 1
//        );
//    }

    // ---------------------- OnlyOwner ----------------------


    function newStrategy(
        address _fromAsset,
        address _toAsset,
        bytes32 _balancerPoolId,
        uint32 _usersLimit
    ) public onlyOwner {
        require(_fromAsset != address(0), "SimpleDCA: fromAsset is zero address");
        require(_balancerPoolId != bytes32(0), "SimpleDCA: balancerPoolId is zero");
        require(_usersLimit > 0, "SimpleDCA: usersLimit must be greater than 0");

        totalStrategies++;
        strategies[totalStrategies] = Strategy({
            fromAsset: _fromAsset,
            toAsset: _toAsset,
            balancerPoolId: _balancerPoolId,
            totalAmountFromAsset: 0,
            totalAmountToAsset: 0,
//            lastExecuted: 0,
            usersCount: 0,
            usersLimit: _usersLimit
        });
    }

}
