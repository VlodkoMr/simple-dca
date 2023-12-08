//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IFlexDCA {
    function bridgeDeposit(uint256 _amount, uint32 _strategyId, address _owner) external;
}

