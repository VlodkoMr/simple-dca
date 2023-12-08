//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "hardhat/console.sol";
import "./interface/IBalancerVault.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./helpers/utils.sol";
import "./interface/ISwapRouterUniswap.sol";
import "./interface/IBridge.sol";
import "./interface/IERC20Extended.sol";

contract FlexDCA is AutomationCompatibleInterface, Ownable, Utils {
    using SafeERC20 for IERC20;
    IBalancerVault private immutable balancerVault;
    ISwapRouterUniswap private immutable uniswapSwapRouter;
    IBridge public bridgeContract;

    uint16 private constant STRATEGY_FEE_PCT = 1; // 1.0%
    uint16 private constant STRATEGY_FEE_DENOMINATOR = 100;
    uint32 public totalStrategies;
    address public feeCollector;

    mapping(uint32 => Strategy) private strategies;
    mapping(uint32 => address[]) public strategyUsers;
    mapping(address => mapping(uint32 => UserStrategyDetails)) public userStrategyDetails;
    mapping(address => uint32[]) public userStrategies;

    struct Strategy {
        uint32 id;
        uint32 usersLimit;
        string title;
        string assetFromTitle;
        string assetToTitle;
        address fromAsset;
        address toAsset;
        bytes32 balancerPoolId;
        address dataFeed;
        uint256 totalBalance;
        uint256 totalAmountFromAsset;
        uint256 totalAmountToAsset;
        bool isActive;
        bool isBridge;
    }

    struct UserStrategyDetails {
        uint32 strategyId;
        uint256 amountLeft;
        uint256 amountOnce;
        uint256 claimAvailable;
        uint256 nextExecute;
        uint256 executeRepeat;
        bool isActive;
    }

    modifier userStrategyExists(uint32 _strategyId) {
        if (userStrategyDetails[msg.sender][_strategyId].strategyId == 0) {
            revert("DCA#01: user strategy does not exist");
        }
        _;
    }

    modifier strategyExists(uint32 _strategyId) {
        if (strategies[_strategyId].id == 0) {
            revert("DCA#02: strategy does not exist");
        }
        _;
    }

    constructor(
        address _initialOwner,
        address _balancerVault,
        address _uniswapSwapRouter,
        address _feeCollector
    ) Ownable(_initialOwner)
    {
        balancerVault = IBalancerVault(_balancerVault);
        if (_uniswapSwapRouter != address(0)) {
            uniswapSwapRouter = ISwapRouterUniswap(_uniswapSwapRouter);
        }

        feeCollector = _feeCollector;
    }

    function getStrategy(uint32 _strategyId)
    public view
    returns (Strategy memory)
    {
        return strategies[_strategyId];
    }

    function joinEditStrategy(uint32 _strategyId, uint256 _executeRepeat, uint256 _amountOnce)
    public
    strategyExists(_strategyId)
    {
        if (userStrategyDetails[msg.sender][_strategyId].strategyId == 0) {
            require(strategyUsers[_strategyId].length < strategies[_strategyId].usersLimit, "DCA#03: Strategy users limit reached");

            userStrategyDetails[msg.sender][_strategyId] = UserStrategyDetails({
                strategyId: _strategyId,
                amountLeft: 0,
                amountOnce: _amountOnce,
                nextExecute: block.timestamp + _executeRepeat,
                claimAvailable: 0,
                executeRepeat: _executeRepeat,
                isActive: false
            });
            userStrategies[msg.sender].push(_strategyId);
        } else {
            UserStrategyDetails storage _userStrategyDetails = userStrategyDetails[msg.sender][_strategyId];
            _userStrategyDetails.executeRepeat = _executeRepeat;
            _userStrategyDetails.amountOnce = _amountOnce;
            _userStrategyDetails.nextExecute = block.timestamp + _executeRepeat;

            if (_userStrategyDetails.isActive == false) {
                _activateUserStrategy(_strategyId, msg.sender);
            }
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

        Strategy storage strategy = strategies[_strategyId];
        strategy.totalBalance += _amount;

        UserStrategyDetails storage userStrategyDetail = userStrategyDetails[msg.sender][_strategyId];
        userStrategyDetail.amountLeft += _amount;

        if (userStrategyDetail.isActive == false) {
            _activateUserStrategy(_strategyId, msg.sender);
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

            Strategy storage strategy = strategies[_strategyId];
            strategy.totalBalance -= _amount;
        }

        if (userStrategyDetail.claimAvailable > 0) {
            claimTokens(_strategyId);
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

        // calculate total swap amount, update user strategies
        for (uint32 _i = 0; _i < _users.length; _i++) {
            UserStrategyDetails storage userStrategyDetail = userStrategyDetails[_users[_i]][_strategyId];
            _totalSwap += userStrategyDetail.amountOnce;
            userStrategyDetail.amountLeft -= userStrategyDetail.amountOnce;
            userStrategyDetail.nextExecute += userStrategyDetail.executeRepeat;
        }

        // swap tokens
        uint256 _returnAssetResult = 0;
        if (strategy.balancerPoolId == bytes32(0)) {
            // uniswap
            _returnAssetResult = uniswapSwap(
                strategy.fromAsset,
                strategy.toAsset,
                _totalSwap
            );
        } else {
            // balancer
            _returnAssetResult = balancerSwap(
                strategy.fromAsset,
                strategy.toAsset,
                strategy.balancerPoolId,
                _totalSwap
            );
        }

        // Check returned amount using data feed
        if (strategy.dataFeed != address(0)) {
            _checkReturnedSwapAmount(strategy, _totalSwap, _returnAssetResult);
        } else {
            // no data fees, basic check
            require(_returnAssetResult > 0, "DCA#06: swap failed, no result returned");
        }

        // update general strategy stats
        strategy.totalAmountFromAsset += _totalSwap;
        strategy.totalAmountToAsset += _returnAssetResult;
        strategy.totalBalance -= _totalSwap;

        // distribute token amounts for each user
        uint256 _denominator = 10 ** 18;
        for (uint32 _i = 0; _i < _users.length; _i++) {
            UserStrategyDetails storage userStrategyDetail = userStrategyDetails[_users[_i]][_strategyId];
            uint256 _userPart = userStrategyDetail.amountOnce * _denominator / _totalSwap;
            userStrategyDetail.claimAvailable += (_returnAssetResult * _userPart) / _denominator;
        }
    }

    function bridgeTokens(
        uint64 _destinationChainSelector,
        address _receiverContract,
        uint32 _strategyId,
        uint32 _destStrategyId,
        uint256 _amount
    )
    public payable
    strategyExists(_strategyId)
    userStrategyExists(_strategyId)
    {
        require(_destStrategyId > 0, "DCA#07: destStrategyId is wrong");
        require(_destinationChainSelector > 0, "DCA#08: destinationChainSelector is wrong");
        require(strategies[_strategyId].isBridge, "DCA#09: strategy bridge is not available");
        require(_receiverContract != address(0), "DCA#10: receiverContract is zero address");
        require(_amount > 0, "DCA#11: amount must be greater than 0");
        require(msg.value > 0, "DCA#12: Wrong fees");

        UserStrategyDetails storage userStrategyDetail = userStrategyDetails[msg.sender][_strategyId];
        Strategy storage strategy = strategies[_strategyId];

        require(userStrategyDetail.amountLeft <= _amount, "DCA#13: amount exceeds balance");
        userStrategyDetail.amountLeft -= _amount;
        strategy.totalBalance -= _amount;

        string memory _data = string(abi.encodePacked(
            _destStrategyId,
            _amount,
            msg.sender
        ));
        bridgeContract.bridgeTokens{value: msg.value}(_destinationChainSelector, _receiverContract, _data);
    }

    // token deposited from bridge
    function bridgeDeposit(uint256 _amount, uint32 _strategyId, address _owner)
    external
    strategyExists(_strategyId)
    {
        require(_amount > 0, "DCA#04: amount must be greater than 0");
        require(msg.sender == address(bridgeContract), "DCA#04: only bridge contract can call this method");
        require(userStrategyDetails[_owner][_strategyId].strategyId != 0, "DCA#01: user strategy does not exist");

        Strategy storage strategy = strategies[_strategyId];
        strategy.totalBalance += _amount;

        UserStrategyDetails storage userStrategyDetail = userStrategyDetails[_owner][_strategyId];
        userStrategyDetail.amountLeft += _amount;

        if (userStrategyDetail.isActive == false) {
            _activateUserStrategy(_strategyId, _owner);
        }
    }

    // ---------------------- Private ----------------------

    function balancerSwap(
        address _fromAsset,
        address _toAsset,
        bytes32 _balancerPoolId,
        uint256 _amount
    )
    private
    returns (uint256)
    {
        IERC20(_fromAsset).approve(address(balancerVault), _amount);

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
            block.timestamp
        );
    }

    function uniswapSwap(
        address _fromAsset,
        address _toAsset,
        uint256 _amount
    )
    private
    returns (uint256)
    {
        IERC20(_fromAsset).approve(address(uniswapSwapRouter), _amount);

        ISwapRouterUniswap.ExactInputSingleParams memory _params = ISwapRouterUniswap.ExactInputSingleParams({
            tokenIn: _fromAsset,
            tokenOut: _toAsset,
            fee: 3000,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: _amount,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        return uniswapSwapRouter.exactInputSingle(_params);
    }

    function _activateUserStrategy(uint32 _strategyId, address _userId)
    private
    {
        require(strategyUsers[_strategyId].length < strategies[_strategyId].usersLimit, "DCA#15: Strategy users limit reached");

        Strategy storage strategy = strategies[_strategyId];
        userStrategyDetails[_userId][_strategyId].isActive = true;

        // Add to userStrategies
        (, bool _existsUs) = Utils.indexOfUint(userStrategies[_userId], _strategyId);
        if (!_existsUs) {
            userStrategies[_userId].push(_strategyId);
        }

        // Add to strategyUsers
        (, bool _existsSt) = Utils.indexOfAddress(strategyUsers[_strategyId], _userId);
        if (!_existsSt) {
            strategyUsers[_strategyId].push(_userId);
        }

        if (strategy.isActive == true && strategyUsers[_strategyId].length >= strategies[_strategyId].usersLimit) {
            strategy.isActive = false;
        }
    }

    function _deactivateUserStrategy(uint32 _strategyId, address _userId)
    private
    {
        userStrategyDetails[_userId][_strategyId].isActive = false;

        // remove from userStrategies
        (uint _indexUs, bool _existsUs) = Utils.indexOfUint(userStrategies[_userId], _strategyId);
        if (_existsUs) {
            uint32 _countStrategies = uint32(userStrategies[_userId].length);
            if (_countStrategies > 1) {
                userStrategies[_userId][_indexUs] = userStrategies[_userId][_countStrategies - 1];
            }
            userStrategies[_userId].pop();
        }

        // remove from strategyUsers
        (uint _indexSt, bool _existsSt) = Utils.indexOfAddress(strategyUsers[_strategyId], _userId);
        if (_existsSt) {
            uint32 _countUsers = uint32(strategyUsers[_strategyId].length);
            if (_countUsers > 1) {
                strategyUsers[_strategyId][_indexSt] = strategyUsers[_strategyId][_countUsers - 1];
            }
            strategyUsers[_strategyId].pop();
        }

        // Update common strategy active status
        Strategy storage strategy = strategies[_strategyId];
        if (strategy.isActive == false) {
            strategy.isActive = true;
        }
    }

    function _transferTokens(address _asset, address _recipient, uint256 _amount)
    private
    {
        require(_asset != address(0), "DCA#16: asset is zero address");

        IERC20 token = IERC20(_asset);
        SafeERC20.safeTransfer(token, _recipient, _amount);
    }

    function _canExecuteUserStrategy(UserStrategyDetails storage _sDetails)
    private view
    returns (bool)
    {
        return _sDetails.isActive && _sDetails.nextExecute <= block.timestamp && _sDetails.amountLeft >= _sDetails.amountOnce;
    }

    function _checkReturnedSwapAmount(Strategy storage strategy, uint256 _totalSwap, uint256 _returnAssetResult)
    private view
    {
        AggregatorV3Interface _priceFeed = AggregatorV3Interface(strategy.dataFeed);
        (, int256 _lastPrice, , ,) = _priceFeed.latestRoundData();

        IERC20Extended _token = IERC20Extended(strategy.toAsset);
        uint256 _decimals = _token.decimals();

        // NOTE: chainlink price scaled up by 10 ** 8;
        uint256 _expectedReturn = _totalSwap * uint256(_lastPrice) * 10 ** _decimals / 10 ** 8;
        uint256 _slippage = _expectedReturn * 2 / 100; // 2%

        uint256 _minReturn = _expectedReturn - _slippage;
        require(_returnAssetResult >= _minReturn, "DCA#17: wrong returned amount");
    }

    // ---------------------- OnlyOwner ----------------------

    // Create new strategy
    function newStrategy(
        string memory _title, string memory _assetFromTitle, string memory _assetToTitle,
        address _fromAsset, address _toAsset, bytes32 _balancerPoolId, address _dataFeed,
        bool _bridge, uint32 _usersLimit
    )
    public
    onlyOwner
    {
        require(bytes(_title).length > 0, "DCA#18: title is required");
        require(_fromAsset != address(0), "DCA#19: fromAsset is zero address");
        require(_toAsset != address(0), "DCA#20: toAsset is zero address");
        require(_usersLimit > 0, "DCA#21: usersLimit must be greater than 0");

        totalStrategies++;
        strategies[totalStrategies] = Strategy({
            id: totalStrategies,
            title: _title,
            assetFromTitle: _assetFromTitle,
            assetToTitle: _assetToTitle,
            fromAsset: _fromAsset,
            toAsset: _toAsset,
            balancerPoolId: _balancerPoolId,
            dataFeed: _dataFeed,
            totalBalance: 0,
            totalAmountFromAsset: 0,
            totalAmountToAsset: 0,
            usersLimit: _usersLimit,
            isActive: true,
            isBridge: _bridge
        });
    }

    // Switch strategy balancer pool
    function updateStrategyPoolId(uint32 _strategyId, bytes32 _balancerPoolId)
    public
    strategyExists(_strategyId)
    onlyOwner
    {
        require(_balancerPoolId != bytes32(0), "DCA#22: balancerPoolId is zero");
        strategies[_strategyId].balancerPoolId = _balancerPoolId;
    }

    // Switch bridge mode for strategy
    function updateStrategyBridge(uint32 _strategyId, bool _isBridge)
    public
    strategyExists(_strategyId)
    onlyOwner
    {
        strategies[_strategyId].isBridge = _isBridge;
    }

    // Switch chainlink data feed for strategy
    function updateStrategyDataFeed(uint32 _strategyId, address _dataFeed)
    public
    strategyExists(_strategyId)
    onlyOwner
    {
        strategies[_strategyId].dataFeed = _dataFeed;
    }

    // Update bridge contract address
    function setBridgeAddress(address _bridgeAddress)
    public
    onlyOwner
    {
        require(address(bridgeContract) == address(0), "DCA#23: bridge address already set");
        bridgeContract = IBridge(_bridgeAddress);
    }

}
