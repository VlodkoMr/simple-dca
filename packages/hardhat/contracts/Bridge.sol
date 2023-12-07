//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "hardhat/console.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";


contract Bridge is CCIPReceiver {
    address private immutable iRouter;
    address private immutable flexDCAContract;
    bool public immutable isTestnet;
    bytes32 public latestMessageId;
    string public chainSelector;

    event MessageSent(bytes32 messageId);

    event MessageReceived(
        bytes32 latestMessageId
//        uint64 latestSourceChainSelector,
//        address latestSender,
//        string latestMessage
    );

    modifier onlyFlexDCAContract() {
        if (msg.sender != flexDCAContract) {
            revert("Bridge#01: only FlexDCA can call");
        }
        _;
    }

    constructor(
        address _flexDCAContract,
        address _router,
        string memory _chainSelector,
        bool _isTestnet
    )
    CCIPReceiver(_router)
    {
        iRouter = _router;
        chainSelector = _chainSelector;
        isTestnet = _isTestnet;
        flexDCAContract = _flexDCAContract;
    }

    receive() external payable {}

    function getMessageWithFee(
        uint64 _destinationChainSelector,
        address _receiverContract,
        string memory _data
    )
    public view
    returns
    (Client.EVM2AnyMessage memory, uint256)
    {
        Client.EVM2AnyMessage memory _message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiverContract),
            data: abi.encode(_data),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 _fee = IRouterClient(iRouter).getFee(
            _destinationChainSelector,
            _message
        );

        return (_message, _fee);
    }

    function bridgeTokens(
        uint64 _destinationChainSelector,
        address _receiverContract,
        string memory _data
    )
    external payable
    onlyFlexDCAContract()
    {
        (Client.EVM2AnyMessage memory _message, uint256 _fee) = getMessageWithFee(
            _destinationChainSelector,
            _receiverContract,
            _data
        );
//        Client.EVM2AnyMessage memory _message = Client.EVM2AnyMessage({
//            receiver: abi.encode(_receiverContract),
//            data: abi.encode(_data),
//            tokenAmounts: new Client.EVMTokenAmount[](0),
//            extraArgs: "",
//            feeToken: address(0)
//        });

//        uint256 _fee = IRouterClient(iRouter).getFee(
//            _destinationChainSelector,
//            _message
//        );
        require(msg.value >= _fee, "Bridge#02: Not enough fees");

        bytes32 _messageId = IRouterClient(iRouter).ccipSend{value: _fee}(
            _destinationChainSelector,
            _message
        );

        emit MessageSent(_messageId);
    }


    function _ccipReceive(
        Client.Any2EVMMessage memory _message
    ) internal override {
        latestMessageId = _message.messageId;
//        latestSourceChainSelector = _message.sourceChainSelector;
//        latestSender = abi.decode(_message.sender, (address));
//        latestMessage = abi.decode(_message.data, (string));
//
        emit MessageReceived(
            latestMessageId
//            latestSourceChainSelector,
//            latestSender,
//            latestMessage
        );
    }

}
