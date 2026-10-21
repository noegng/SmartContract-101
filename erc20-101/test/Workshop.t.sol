// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {Test} from "forge-std/Test.sol";
import {Workshop} from "../src/erc20_ex10.sol";

contract WorkshopTest is Test {
    function test_ex10() public {
        vm.createSelectFork("sepolia");
        vm.deal(0x05A644d6d9BBd85861ff927245aaC13bd56e6d57, 1 ether);
        Workshop w = new Workshop();
        w.launch();
    }
}