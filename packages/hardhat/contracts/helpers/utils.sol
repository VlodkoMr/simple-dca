//SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract Utils {

    // @title Check if value exists in array and return index
    function indexOf(address[] memory _self, address _value) internal pure returns (uint, bool) {
        uint _length = _self.length;
        for (uint32 _i = 0; _i < _length; ++_i) if (_self[_i] == _value) return (_i, true);
        return (0, false);
    }

}