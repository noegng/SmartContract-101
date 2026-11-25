// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

pragma experimental ABIEncoderV2;

import "./ERC20_102.sol";
import "./ERC20Claimable.sol";
import "./IExerciseSolution.sol";
import "./IERC20Mintable.sol";

contract Evaluator {
    mapping(address => bool) public teachers;
    ERC20_102 TDERC20;
    ERC20Claimable claimableERC20;

    uint256[20] private randomSupplies;
    string[20] private randomTickers;
    uint public nextValueStoreRank;

    mapping(address => mapping(uint256 => bool)) public exerciseProgression;
    mapping(address => IExerciseSolution) public studentExerciseSolution;
    mapping(address => bool) public hasBeenPaired;

    event newRandomTickerAndSupply(string ticker, uint256 supply);
    event constructedCorrectly(
        address erc20Address,
        address claimableERC20Address
    );

    constructor(ERC20_102 _TDERC20, ERC20Claimable _claimableERC20) {
        TDERC20 = _TDERC20;
        claimableERC20 = _claimableERC20;
        emit constructedCorrectly(address(TDERC20), address(claimableERC20));
    }

    fallback() external payable {}

    receive() external payable {}

    function ex1_claimedPoints() public {
        // Check the user has some tokens
        require(
            claimableERC20.balanceOf(msg.sender) > 0,
            "Sender has no tokens"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][1]) {
            exerciseProgression[msg.sender][1] = true;
            TDERC20.distributeTokens(msg.sender, 1);
            TDERC20.distributeTokens(msg.sender, 1);
            TDERC20.distributeTokens(msg.sender, 1);
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    function ex2_claimedFromContract() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        // Checking how many tokens ExerciseSolution holds
        uint256 solutionInitBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );

        // Claiming tokens through ExerciseSolution
        studentExerciseSolution[msg.sender].claimTokensOnBehalf();

        // Verifying ExerciseSolution holds tokens
        uint256 solutionEndBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        require(
            solutionEndBalance - solutionInitBalance ==
                claimableERC20.distributedAmount(),
            "No claimable tokens minted to ExerciseSolution"
        );

        // Verifying ExerciseSolution kept track of our balance
        studentExerciseSolution[msg.sender].claimTokensOnBehalf();
        require(
            studentExerciseSolution[msg.sender].tokensInCustody(
                address(this)
            ) == 2 * claimableERC20.distributedAmount(),
            "Balance of sender not kept in ExerciseSolution"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][2]) {
            exerciseProgression[msg.sender][2] = true;
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    function ex3_withdrawFromContract() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        // Checking how many tokens ExerciseSolution and Evaluator hold
        uint256 solutionInitBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfInitBalance = claimableERC20.balanceOf(address(this));
        uint256 amountToWithdraw = studentExerciseSolution[msg.sender]
            .tokensInCustody(address(this));

        // Withdraw tokens through ExerciseSolution
        studentExerciseSolution[msg.sender].withdrawTokens(amountToWithdraw);

        // Verifying tokens where withdrew correctly
        uint256 solutionEndBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfEndBalance = claimableERC20.balanceOf(address(this));
        uint256 amountLeft = studentExerciseSolution[msg.sender]
            .tokensInCustody(address(this));

        require(
            solutionInitBalance - solutionEndBalance == amountToWithdraw,
            "ExerciseSolution has an incorrect amount of tokens"
        );
        require(
            selfEndBalance - selfInitBalance == amountToWithdraw,
            "Evaluator has an incorrect amount of tokens"
        );
        require(amountLeft == 0, "Tokens left held by ExerciseSolution");

        // Crediting points
        if (!exerciseProgression[msg.sender][3]) {
            exerciseProgression[msg.sender][3] = true;
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    function ex4_approvedExerciseSolution() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        require(
            claimableERC20.allowance(
                msg.sender,
                address(studentExerciseSolution[msg.sender])
            ) > 0,
            "ExerciseSolution no allowed to spend msg.sender tokens"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][4]) {
            exerciseProgression[msg.sender][4] = true;
            TDERC20.distributeTokens(msg.sender, 1);
        }
    }

    function ex5_revokedExerciseSolution() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        require(
            claimableERC20.allowance(
                msg.sender,
                address(studentExerciseSolution[msg.sender])
            ) == 0,
            "ExerciseSolution still allowed to spend msg.sender tokens"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][5]) {
            exerciseProgression[msg.sender][5] = true;
            TDERC20.distributeTokens(msg.sender, 1);
        }
    }

    function ex6_depositTokens() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        uint256 amountToDeposit = 100;

        // Checking how many tokens ExerciseSolution and Evaluator hold
        uint256 solutionInitBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfInitBalance = claimableERC20.balanceOf(address(this));
        uint256 amountDeposited = studentExerciseSolution[msg.sender]
            .tokensInCustody(address(this));
        require(
            selfInitBalance >= amountToDeposit,
            "Evaluator does not hold enough tokens"
        );

        // Approve student solution to manipulate our tokens
        claimableERC20.increaseAllowance(
            address(studentExerciseSolution[msg.sender]),
            amountToDeposit
        );

        // Deposit tokens in student contract
        studentExerciseSolution[msg.sender].depositTokens(amountToDeposit);

        // Check balances are correct
        uint256 solutionEndBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfEndBalance = claimableERC20.balanceOf(address(this));
        uint256 amountLeft = studentExerciseSolution[msg.sender]
            .tokensInCustody(address(this));

        require(
            solutionEndBalance - solutionInitBalance == amountToDeposit,
            "ExerciseSolution has an incorrect amount of tokens"
        );
        require(
            selfInitBalance - selfEndBalance == amountToDeposit,
            "Evaluator has an incorrect amount of tokens"
        );
        require(
            amountLeft - amountDeposited == amountToDeposit,
            "Balance of Evaluator not credited correctly in ExerciseSolution"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][6]) {
            exerciseProgression[msg.sender][6] = true;
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    function ex7_createERC20() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        // Get ExerciseSolutionERC20 address
        address exerciseSolutionERC20 = studentExerciseSolution[msg.sender]
            .getERC20DepositAddress();
        IERC20Mintable ExerciseSolutionERC20 = IERC20Mintable(
            exerciseSolutionERC20
        );

        // Check that ExerciseSolution is a minter to ExerciseSolutionERC20
        // Check that we are not a minter to ExerciseSolutionERC20
        require(
            ExerciseSolutionERC20.isMinter(
                address(studentExerciseSolution[msg.sender])
            ),
            "ExerciseSolution is not minter"
        );
        require(
            !ExerciseSolutionERC20.isMinter(address(this)),
            "Evaluator is minter"
        );

        // Check that we can not mint ExerciseSolutionERC20 tokens
        bool wasMintAccepted = false;
        try ExerciseSolutionERC20.mint(address(this), 10000) {
            wasMintAccepted = true;
        } catch {
            // This is executed in case revert() was used.
            wasMintAccepted = false;
        }

        require(!wasMintAccepted, "Evaluator was able to mint");

        // Crediting points
        if (!exerciseProgression[msg.sender][7]) {
            exerciseProgression[msg.sender][7] = true;
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    function ex8_depositAndMint() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        uint256 amountToDeposit = 100;

        // Checking how many tokens ExerciseSolution and Evaluator hold
        uint256 solutionInitBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfInitBalance = claimableERC20.balanceOf(address(this));
        address exerciseSolutionERC20 = studentExerciseSolution[msg.sender]
            .getERC20DepositAddress();
        IERC20Mintable ExerciseSolutionERC20 = IERC20Mintable(
            exerciseSolutionERC20
        );
        uint256 amountDeposited = ExerciseSolutionERC20.balanceOf(
            address(this)
        );
        uint256 initWrappedTotalSupply = ExerciseSolutionERC20.totalSupply();
        require(
            selfInitBalance >= amountToDeposit,
            "Evaluator does not hold enough tokens"
        );

        // Approve student solution to manipulate our tokens
        claimableERC20.increaseAllowance(
            address(studentExerciseSolution[msg.sender]),
            amountToDeposit
        );

        // Deposit tokens in student contract
        studentExerciseSolution[msg.sender].depositTokens(amountToDeposit);

        // Check balances are correct
        uint256 solutionEndBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfEndBalance = claimableERC20.balanceOf(address(this));
        uint256 amountLeft = ExerciseSolutionERC20.balanceOf(address(this));
        uint256 endWrappedTotalSupply = ExerciseSolutionERC20.totalSupply();

        require(
            solutionEndBalance - solutionInitBalance == amountToDeposit,
            "ExerciseSolution has an incorrect amount of tokens"
        );
        require(
            selfInitBalance - selfEndBalance == amountToDeposit,
            "Evaluator has an incorrect amount of tokens"
        );
        require(
            amountLeft - amountDeposited == amountToDeposit,
            "Balance of Evaluator not credited correctly in ExerciseSolutionErc20"
        );
        require(
            endWrappedTotalSupply - initWrappedTotalSupply == amountToDeposit,
            "ExerciseSolutionErc20 were not minted correctly"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][8]) {
            exerciseProgression[msg.sender][8] = true;
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    function ex9_withdrawAndBurn() public {
        // Checking a solution was submitted
        require(exerciseProgression[msg.sender][0], "No solution submitted");

        // Checking how many tokens ExerciseSolution and Evaluator hold
        uint256 solutionInitBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfInitBalance = claimableERC20.balanceOf(address(this));
        address exerciseSolutionERC20 = studentExerciseSolution[msg.sender]
            .getERC20DepositAddress();
        IERC20Mintable ExerciseSolutionERC20 = IERC20Mintable(
            exerciseSolutionERC20
        );
        uint256 amountToWithdraw = ExerciseSolutionERC20.balanceOf(
            address(this)
        );
        uint256 initWrappedTotalSupply = ExerciseSolutionERC20.totalSupply();

        // Withdraw tokens through ExerciseSolution
        studentExerciseSolution[msg.sender].withdrawTokens(amountToWithdraw);

        // Verifying tokens where withdrew correctly
        uint256 solutionEndBalance = claimableERC20.balanceOf(
            address(studentExerciseSolution[msg.sender])
        );
        uint256 selfEndBalance = claimableERC20.balanceOf(address(this));
        uint256 amountLeft = ExerciseSolutionERC20.balanceOf(address(this));
        uint256 endWrappedTotalSupply = ExerciseSolutionERC20.totalSupply();

        require(
            solutionInitBalance - solutionEndBalance == amountToWithdraw,
            "ExerciseSolution has an incorrect amount of tokens"
        );
        require(
            selfEndBalance - selfInitBalance == amountToWithdraw,
            "Evaluator has an incorrect amount of tokens"
        );
        require(amountLeft == 0, "Tokens still credited ExerciseSolutionErc20");
        require(
            initWrappedTotalSupply - endWrappedTotalSupply == amountToWithdraw,
            "ExerciseSolutionErc20 were not burned correctly"
        );

        // Crediting points
        if (!exerciseProgression[msg.sender][9]) {
            exerciseProgression[msg.sender][9] = true;
            TDERC20.distributeTokens(msg.sender, 2);
        }
    }

    /* Internal functions and modifiers */
    function submitExercise(IExerciseSolution studentExercise) public {
        // Checking this contract was not used by another group before
        require(!hasBeenPaired[address(studentExercise)]);

        // Assigning passed ERC20 as student ERC20
        studentExerciseSolution[msg.sender] = studentExercise;
        hasBeenPaired[address(studentExercise)] = true;

        if (!exerciseProgression[msg.sender][0]) {
            exerciseProgression[msg.sender][0] = true;
            TDERC20.distributeTokens(msg.sender, 1);
        }
    }

    modifier onlyTeachers() {
        require(TDERC20.teachers(msg.sender));
        _;
    }

    function _compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function bytes32ToString(
        bytes32 _bytes32
    ) public pure returns (string memory) {
        uint8 i = 0;
        while (i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
