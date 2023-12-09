//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenFDCA is ERC20 {
    address private immutable flexDCAContract;
    uint256 public constant maxSupply = 10 * 10 ** 6 * 10 ** 18;

    constructor(string memory _name, string memory _symbol, address _flexDCAContract)
    ERC20(_name, _symbol)
    {
        flexDCAContract = _flexDCAContract;
        _mint(msg.sender, maxSupply / 2);
    }

    function mintTokens(address _address, uint256 _amount) external {
        if (msg.sender != flexDCAContract) {
            revert("fDCA#02: Only FlexDCA contract can update rewards");
        }
        if (_address == address(0)) {
            revert("fDCA#03: Invalid recipient address");
        }

        if (_amount > 0 && totalSupply() + _amount <= maxSupply) {
            _mint(_address, _amount);
        }
    }

}