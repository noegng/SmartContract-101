// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExerciseSolutionToken is ERC20 {
    address public owner;
    mapping(address => bool) public isMinter;

    constructor() ERC20("ExerciseSolutionToken", "EST") {
        owner = msg.sender;
        isMinter[msg.sender] = true;
    }

    modifier onlyMinter() {
        require(isMinter[msg.sender], "Not minter");
        _;
    }

    function setMinter(address minterAddress, bool _isMinter) external {
        require(msg.sender == owner, "Not owner");
        isMinter[minterAddress] = _isMinter;
    }

    function mint(address toAddress, uint256 amount) external onlyMinter {
        _mint(toAddress, amount);
    }

    function burn(address fromAddress, uint256 amount) external onlyMinter {
        _burn(fromAddress, amount);
    }
}
