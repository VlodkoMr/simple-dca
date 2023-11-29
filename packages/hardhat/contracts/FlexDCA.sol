//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "hardhat/console.sol";
import "./interface/IVault.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./helpers/utils.sol";

contract FlexDCA is AutomationCompatibleInterface, Ownable, Utils {
    using SafeERC20 for IERC20;
    IVault public balancerVault;

    uint16 constant STRATEGY_FEE_PCT = 1; // 1.0%
    uint16 constant STRATEGY_FEE_DENOMINATOR = 100;
    uint32 public totalStrategies;
    address public feeCollector;

    mapping(uint32 => Strategy) public strategies;
    mapping(uint32 => address[]) public strategyUsers;
    mapping(address => mapping(uint32 => UserStrategyDetails)) public userStrategyDetails;
    mapping(address => uint32[]) public userStrategies;

    struct Strategy {
        string title;
        address fromAsset;
        address toAsset;
        bytes32 balancerPoolId;
        uint256 totalAmountFromAsset;
        uint256 totalAmountToAsset;
        uint32 usersLimit;
    }

    struct UserStrategyDetails {
        uint256 amountLeft;
        uint256 amountOnce;
        uint256 claimAvailable;
        uint256 nextExecute;
        uint256 executeRepeat;
        bool active;
    }

    modifier userStrategyExists(uint32 _strategyId) {
        if (userStrategyDetails[msg.sender][_strategyId].nextExecute == 0) {
            revert("DCA#01: user strategy does not exist");
        }
        _;
    }

    modifier strategyExists(uint32 _strategyId) {
        if (strategies[_strategyId].balancerPoolId == bytes32(0)) {
            revert("DCA#02: strategy does not exist");
        }
        _;
    }

    constructor(address _initialOwner, address _balancerVault, address _feeCollector)
    Ownable(_initialOwner)
    {
        balancerVault = IVault(_balancerVault);
        feeCollector = _feeCollector;
    }

    fallback() external payable {}

    receive() external payable {}

    function joinEditStrategy(uint32 _strategyId, uint256 _executeRepeat, uint256 _amountOnce)
    public
    strategyExists(_strategyId)
    {
        if (userStrategyDetails[msg.sender][_strategyId].nextExecute == 0) {
            require(strategyUsers[_strategyId].length < strategies[_strategyId].usersLimit, "DCA#03: Strategy users limit reached");

            userStrategyDetails[msg.sender][_strategyId] = UserStrategyDetails({
                amountLeft: 0,
                amountOnce: _amountOnce,
                nextExecute: block.timestamp + _executeRepeat,
                claimAvailable: 0,
                executeRepeat: _executeRepeat,
                active: false
            });
            userStrategies[msg.sender].push(_strategyId);
        } else {
            UserStrategyDetails storage _userStrategyDetails = userStrategyDetails[msg.sender][_strategyId];
            _userStrategyDetails.executeRepeat = _executeRepeat;
            _userStrategyDetails.amountOnce = _amountOnce;
            _userStrategyDetails.nextExecute = block.timestamp + _executeRepeat;
        }
    }

    function exitStrategy(uint32 _strategyId)
    public
    strategyExists(_strategyId)
    userStrategyExists(_strategyId)
    {
        _deactivateUserStrategy(_strategyId, msg.sender);

        // return unused amount
        UserStrategyDetails storage userStrategyDetail = userStrategyDetails[msg.sender][_strategyId];

        if (userStrategyDetail.amountLeft > 0) {
            uint256 _amount = userStrategyDetail.amountLeft;
            userStrategyDetail.amountLeft = 0;
            _transferTokens(strategies[_strategyId].fromAsset, msg.sender, _amount);
        }

        if (userStrategyDetail.claimAvailable > 0) {
            uint256 _amount = userStrategyDetail.claimAvailable;
            uint256 _amountFee = _amount * STRATEGY_FEE_PCT / STRATEGY_FEE_DENOMINATOR;
            userStrategyDetail.claimAvailable = 0;
            _transferTokens(strategies[_strategyId].toAsset, msg.sender, _amount - _amountFee);

            // platform fees
            _transferTokens(strategies[_strategyId].toAsset, feeCollector, _amountFee);
        }
    }

    function deposit(uint256 _amount, uint32 _strategyId)
    public
    strategyExists(_strategyId)
    userStrategyExists(_strategyId)
    {
        require(_amount > 0, "DCA#04: amount must be greater than 0");

        IERC20 token = IERC20(strategies[_strategyId].fromAsset);
        SafeERC20.safeTransferFrom(token, address(msg.sender), address(this), _amount);

        UserStrategyDetails storage userStrategyDetail = userStrategyDetails[msg.sender][_strategyId];
        userStrategyDetail.amountLeft += _amount;

        if (userStrategyDetail.active == false) {
            _activateUserStrategy(_strategyId, msg.sender);
        }
    }

    function claimTokens(uint32 _strategyId)
    public
    strategyExists(_strategyId)
    userStrategyExists(_strategyId)
    {
        UserStrategyDetails storage userStrategyDetail = userStrategyDetails[msg.sender][_strategyId];
        require(userStrategyDetail.claimAvailable > 0, "DCA#05: nothing to claim");
        uint256 _amount = userStrategyDetail.claimAvailable;
        uint256 _amountFee = _amount * STRATEGY_FEE_PCT / STRATEGY_FEE_DENOMINATOR;
        userStrategyDetail.claimAvailable = 0;

        _transferTokens(strategies[_strategyId].toAsset, msg.sender, _amount);

        // platform fees
        _transferTokens(strategies[_strategyId].toAsset, feeCollector, _amountFee);
    }

    function getAllUserStrategies(address _user)
    public view
    returns (UserStrategyDetails[] memory)
    {
        uint32 _strategyCount = uint32(userStrategies[_user].length);
        UserStrategyDetails[] memory _result = new UserStrategyDetails[](_strategyCount);
        for (uint32 _i = 0; _i < _strategyCount; _i++) {
            uint32 _strategyId = userStrategies[_user][_i];
            _result[_i] = userStrategyDetails[_user][_strategyId];
        }

        return _result;
    }

    function getAllStrategies()
    public view
    returns (Strategy[] memory)
    {
        Strategy[] memory _result = new Strategy[](totalStrategies);
        for (uint32 _i = 0; _i < totalStrategies; _i++) {
            _result[_i] = strategies[_i + 1];
        }

        return _result;
    }

    function checkUpkeep(bytes calldata checkData)
    external view
    override
    returns (bool, bytes memory)
    {
        (uint32 _strategyId, uint32 _fromIndex, uint32 _toIndex) = abi.decode(
            checkData,
            (uint32, uint32, uint32)
        );

        if (strategyUsers[_strategyId].length <= _fromIndex) {
            return (false, "");
        }
        if (strategyUsers[_strategyId].length < _toIndex) {
            _toIndex = uint32(strategyUsers[_strategyId].length - 1);
        }

        // get number of elements
        uint32 counter;
        for (uint32 i = 0; i < _toIndex - _fromIndex + 1; i++) {
            address _user = strategyUsers[_strategyId][_fromIndex + i];
            UserStrategyDetails storage _userStrategyDetails = userStrategyDetails[_user][_strategyId];
            if (_canExecuteUserStrategy(_userStrategyDetails)) {
                counter++;
            }
        }

        bool _upkeepNeeded = false;
        uint256 _indexCounter;
        address[] memory _users = new address[](counter);

        for (uint256 i = 0; i < _toIndex - _fromIndex + 1; i++) {
            address _user = strategyUsers[_strategyId][_fromIndex + i];
            UserStrategyDetails storage _userStrategyDetails = userStrategyDetails[_user][_strategyId];
            if (_canExecuteUserStrategy(_userStrategyDetails)) {
                _upkeepNeeded = true;
                _users[_indexCounter] = _user;
                _indexCounter++;
            }
        }

        bytes memory _performData = abi.encode(_strategyId, _users);
        return (_upkeepNeeded, _performData);
    }


    function performUpkeep(bytes calldata _performData)
    external override
    {
        (uint32 _strategyId, address[] memory _users) = abi.decode(
            _performData,
            (uint32, address[])
        );

        uint256 _totalSwap = 0;
        Strategy storage strategy = strategies[_strategyId];

        for (uint32 _i = 0; _i < _users.length; _i++) {
            UserStrategyDetails storage userStrategyDetail = userStrategyDetails[_users[_i]][_strategyId];
            _totalSwap += userStrategyDetail.amountOnce;
            userStrategyDetail.amountLeft -= userStrategyDetail.amountOnce;
            userStrategyDetail.nextExecute += userStrategyDetail.executeRepeat;
        }

        IERC20(strategy.fromAsset).approve(address(balancerVault), _totalSwap);
        uint256 _result = swap(
            strategy.fromAsset,
            strategy.toAsset,
            strategy.balancerPoolId,
            _totalSwap
        );

        strategy.totalAmountFromAsset += _totalSwap;
        strategy.totalAmountToAsset += _result;

        uint256 _denominator = 10 ** 18;
        for (uint32 _i = 0; _i < _users.length; _i++) {
            UserStrategyDetails storage userStrategyDetail = userStrategyDetails[_users[_i]][_strategyId];
            uint256 _userPart = userStrategyDetail.amountOnce * _denominator / _totalSwap;
            userStrategyDetail.claimAvailable += (_result * _userPart) / _denominator;
        }
    }

    // ---------------------- Private ----------------------

    function swap(
        address _fromAsset,
        address _toAsset,
        bytes32 _balancerPoolId,
        uint256 _amount
    )
    public
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
            recipient: payable(address(this)),
            toInternalBalance: false
        });

        return balancerVault.swap(
            _singleSwap,
            _funds,
            _amount,
            block.timestamp + 1
        );
    }

    function _activateUserStrategy(uint32 _strategyId, address _userId)
    private
    {
        require(strategyUsers[_strategyId].length < strategies[_strategyId].usersLimit, "DCA#06: Strategy users limit reached");

        userStrategyDetails[_userId][_strategyId].active = true;
        (, bool _exists) = Utils.indexOf(strategyUsers[_strategyId], _userId);
        if (!_exists) {
            strategyUsers[_strategyId].push(_userId);
        }
    }

    function _deactivateUserStrategy(uint32 _strategyId, address _userId)
    private
    {
        userStrategyDetails[_userId][_strategyId].active = false;
        (uint _index, bool _exists) = Utils.indexOf(strategyUsers[_strategyId], _userId);
        if (_exists) {
            strategyUsers[_strategyId][_index] = strategyUsers[_strategyId][strategyUsers[_strategyId].length - 1];
            strategyUsers[_strategyId].pop();
        }
    }

    function _transferTokens(address _asset, address _recipient, uint256 _amount)
    private
    {
        if (_asset == address(0)) {
            (bool _result,) = payable(_recipient).call{value: _amount}("");
            require(_result, "DCA#07: Claim failed");
        } else {
            IERC20 token = IERC20(_asset);
            SafeERC20.safeTransfer(token, _recipient, _amount);
        }
    }

    function _canExecuteUserStrategy(UserStrategyDetails storage _sDetails)
    private view
    returns (bool)
    {
        return _sDetails.active && _sDetails.nextExecute <= block.timestamp && _sDetails.amountLeft >= _sDetails.amountOnce;
    }

    // ---------------------- OnlyOwner ----------------------

    function newStrategy(
        string memory _title,
        address _fromAsset,
        address _toAsset,
        bytes32 _balancerPoolId,
        uint32 _usersLimit
    ) public onlyOwner {
        require(bytes(_title).length > 0, "DCA#11: title is required");
        require(_fromAsset != address(0), "DCA#08: fromAsset is zero address");
        require(_balancerPoolId != bytes32(0), "DCA#09: balancerPoolId is zero");
        require(_usersLimit > 0, "DCA#10: usersLimit must be greater than 0");

        totalStrategies++;
        strategies[totalStrategies] = Strategy({
            title: _title,
            fromAsset: _fromAsset,
            toAsset: _toAsset,
            balancerPoolId: _balancerPoolId,
            totalAmountFromAsset: 0,
            totalAmountToAsset: 0,
            usersLimit: _usersLimit
        });
    }

}
