//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IBridge {
    function bridgeTokens(uint64, address, string memory, address) external payable;
}

