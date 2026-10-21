// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20_ex1} from "./ERC20_ex1.sol";

contract ERC20_ex3 is ERC20_ex1 {
address public immutable owner;
    // Le constructeur enfant doit appeler celui du parent
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20_ex1(name_, symbol_, initialSupply_) {
        owner = msg.sender;
    }
    // ex3 
    function getToken() public virtual returns(bool){
       _mint(msg.sender, 100 * 10 ** decimals());
       return true;
    }

    // ex4
    function buyToken() public payable virtual returns(bool) {
        require(msg.value > 0, "No ETH sent");
        _mint(msg.sender, msg.value * 1000);
        return true;
    }

    // Pour ex4, tu ajouteras plus tard :
    // function buyToken() external payable { ... }
}