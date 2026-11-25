// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ERC20Claimable is ERC20 {
    uint256 public distributedAmount = 100002500002300000;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
    }

    function claimTokens() public returns (uint256) {
        _mint(msg.sender, distributedAmount);
        return distributedAmount;
    }
}
