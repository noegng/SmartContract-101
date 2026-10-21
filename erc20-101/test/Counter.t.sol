// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {ERC20_ex7} from "../src/ERC20_ex7.sol";

interface IEvaluator {
    function ex1_getTickerAndSupply() external;
    function readTicker(address student) external view returns (string memory);
    function readSupply(address student) external view returns (uint256);
    function submitExercice(address erc20) external;
    function ex2_testErc20TickerAndSupply() external;
    function ex3_testGetToken() external;
    function ex4_testBuyToken() external;
    function ex5_testDenyListing() external;
    function ex6_testAllowListing() external;
    function ex7_testDenyListing() external;
    function ex8_testTier1Listing() external;
    function ex9_testTier2Listing() external;
}

contract EvaluatorTest is Test {
    IEvaluator evaluator =
        IEvaluator(0x05A644d6d9BBd85861ff927245aaC13bd56e6d57);
    ERC20_ex7 token;

    function setUp() public {
        vm.createSelectFork("sepolia");

        // Le contrat de test joue l'étudiant (msg.sender = address(this))
        evaluator.ex1_getTickerAndSupply();

        string memory ticker = evaluator.readTicker(address(this));
        uint256 supply = evaluator.readSupply(address(this));

        token = new ERC20_ex7("NMoon", ticker, supply);

        evaluator.submitExercice(address(token));
    }

    function test_tickerAndSupply() public view {
        assertEq(token.symbol(), evaluator.readTicker(address(this)));
        assertEq(token.totalSupply(), evaluator.readSupply(address(this)));
    }

    function test_ex2() public {
        evaluator.ex2_testErc20TickerAndSupply();
    }

    /* function test_ex3() public {
        uint256 before = token.balanceOf(address(evaluator));
        evaluator.ex3_testGetToken();
        assertGt(token.balanceOf(address(evaluator)), before);
    } */

    /* function test_ex4() public {
        // L'evaluator envoie lui-même l'ETH : il doit en avoir
        vm.deal(address(evaluator), 1 ether);

        uint256 before = token.balanceOf(address(evaluator));
        evaluator.ex4_testBuyToken();
        assertGt(token.balanceOf(address(evaluator)), before);
    } */

/* function test_ex5() public {
    evaluator.ex5_testDenyListing();
}

function test_ex6() public {
    evaluator.ex5_testDenyListing();
    token.setAllowList(address(evaluator), true);
    evaluator.ex6_testAllowListing();
} */

function test_ex7() public {
    evaluator.ex7_testDenyListing();
}

function test_ex8() public {
    vm.deal(address(evaluator), 1 ether);
    evaluator.ex7_testDenyListing();
    token.setTier(address(evaluator), 1);
    evaluator.ex8_testTier1Listing();
}

function test_ex9() public {
    vm.deal(address(evaluator), 1 ether);
    evaluator.ex7_testDenyListing();
    token.setTier(address(evaluator), 1);
    evaluator.ex8_testTier1Listing();
    token.setTier(address(evaluator), 2);
    evaluator.ex9_testTier2Listing();
}

}