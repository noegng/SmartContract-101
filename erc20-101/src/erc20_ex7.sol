// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20_ex3} from "./ERC20_ex3-4.sol";

contract ERC20_ex7 is ERC20_ex3 {
    // 0 = refusé, 1 = niveau 1, 2 = niveau 2
    mapping(address => uint256) public tierLevel;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20_ex3(name_, symbol_, initialSupply_) {}

    function setTier(address user, uint256 tier) external {
        require(msg.sender == owner, "Not owner");
        require(tier <= 2, "Invalid tier");
        tierLevel[user] = tier;
    }

    function isCustomerWhiteListed(address customer) external view returns (bool) {
        return tierLevel[customer] > 0;
    }

    function customerTierLevel(address customer) external view returns (uint256) {
        return tierLevel[customer];
    }

    function buyToken() public payable override returns (bool) {
        uint256 tier = tierLevel[msg.sender];
        require(tier > 0, "Not allow-listed");
        require(msg.value > 0, "No ETH sent");
        _mint(msg.sender, msg.value * 1000 * tier);
        return true;
    }
}