// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20_ex3} from "./ERC20_ex3-4.sol";

contract ERC20_ex5 is ERC20_ex3 {
    mapping(address => bool) public allowList;

    event AllowListUpdated(address indexed user, bool allowed);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20_ex3(name_, symbol_, initialSupply_) {
        allowList[msg.sender] = true;
    }

    modifier onlyAllowed() {
        require(allowList[msg.sender], "Not allow-listed");
        _;
    }

    function isCustomerWhiteListed(address customer) external view returns (bool) {
    return allowList[customer];
    }

    function setAllowList(address user, bool allowed) external {
        require(msg.sender == owner, "Not owner");
        allowList[user] = allowed;
        emit AllowListUpdated(user, allowed);
    }

    function getToken() public override onlyAllowed returns (bool) {
        return super.getToken();
    }

}