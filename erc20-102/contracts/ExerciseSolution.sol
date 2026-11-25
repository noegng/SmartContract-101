// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import "./ERC20Claimable.sol";
import "./ExerciseSolutionToken.sol";

contract ExerciseSolution {
    ERC20Claimable public claimableERC20;
    ExerciseSolutionToken public depositToken;
    mapping(address => uint256) public tokensInCustody;

    constructor(ERC20Claimable _claimableERC20) {
        claimableERC20 = _claimableERC20;
        // This contract deploys the token, so it is its only minter
        depositToken = new ExerciseSolutionToken();
    }

    function getERC20DepositAddress() external view returns (address) {
        return address(depositToken);
    }

    // Claim tokens from the teacher's ERC20 and credit them to the caller
    function claimTokensOnBehalf() external {
        uint256 amount = claimableERC20.claimTokens();
        tokensInCustody[msg.sender] += amount;
    }

    // Deposit claimable tokens (caller approves first) and get wrapped tokens
    function depositTokens(uint256 amount) external returns (uint256) {
        claimableERC20.transferFrom(msg.sender, address(this), amount);
        tokensInCustody[msg.sender] += amount;
        depositToken.mint(msg.sender, amount);
        return amount;
    }

    // Burn wrapped tokens and send back claimable tokens
    function withdrawTokens(uint256 amount) external returns (uint256) {
        tokensInCustody[msg.sender] -= amount; // reverts if not enough
        depositToken.burn(msg.sender, amount);
        claimableERC20.transfer(msg.sender, amount);
        return amount;
    }
}
