//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFDCA is ERC20 {
    address private immutable flexDCAContract;

    constructor(string memory _name, string memory _symbol, address _flexDCAContract)
    ERC20(_name, _symbol)
    {
        flexDCAContract = _flexDCAContract;
    }

    function mintTokens(address _address, uint256 _amount) external {
        if (msg.sender != flexDCAContract) {
            revert("fDCA#02: Only FlexDCA contract can update rewards");
        }

        _mint(_address, _amount);
    }

    function _update(address _from, address _to, uint256 _value)
    internal
    override(ERC20)
    {
        if (_from == address(0)) {
            super._update(_from, _to, _value);
        } else {
            revert("fDCA#02: Token is not transferable");
        }
    }

}