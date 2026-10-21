// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC20_ex3} from "./ERC20_ex3-4.sol";

// Token unique : getToken et buyToken dépendent du tier
contract ERC20_final is ERC20_ex3 {
    mapping(address => uint256) public tierLevel;

    constructor(string memory n, string memory s, uint256 supply)
        ERC20_ex3(n, s, supply) {}

    function setTier(address user, uint256 tier) external {
        require(msg.sender == owner, "Not owner");
        require(tier <= 2, "Invalid tier");
        tierLevel[user] = tier;
    }

    function isCustomerWhiteListed(address c) external view returns (bool) {
        return tierLevel[c] > 0;
    }

    function customerTierLevel(address c) external view returns (uint256) {
        return tierLevel[c];
    }

    function getToken() public override returns (bool) {
        require(tierLevel[msg.sender] > 0, "Not allow-listed");
        return super.getToken();
    }

    function buyToken() public payable override returns (bool) {
        uint256 tier = tierLevel[msg.sender];
        require(tier > 0, "Not allow-listed");
        require(msg.value > 0, "No ETH sent");
        _mint(msg.sender, msg.value * 1000 * tier);
        return true;
    }
}

interface IEvaluatorAll {
    function ex0_setupProject() external;
    function ex1_getTickerAndSupply() external;
    function readTicker(address s) external view returns (string memory);
    function readSupply(address s) external view returns (uint256);
    function submitExercice(address erc20) external;
    function ex2_testErc20TickerAndSupply() external;
    function ex3_testGetToken() external;
    function ex4_testBuyToken() external;
    function ex5_testDenyListing() external;
    function ex6_testAllowListing() external;
    function ex7_testDenyListing() external;
    function ex8_testTier1Listing() external;
    function ex9_testTier2Listing() external;
    function ex10_allInOne() external;
}

contract Workshop {
    IEvaluatorAll constant EV =
        IEvaluatorAll(0x05A644d6d9BBd85861ff927245aaC13bd56e6d57);

    function launch() external {
        EV.ex10_allInOne();
    }

    function completeWorkshop() external {
        require(msg.sender == address(EV), "Only evaluator");
        EV.ex0_setupProject();
        EV.ex1_getTickerAndSupply();
        string memory t = EV.readTicker(address(this));
        uint256 s = EV.readSupply(address(this));

        ERC20_final token = new ERC20_final("NMoon", t, s);
        address ev = address(EV);

        EV.submitExercice(address(token));
        EV.ex2_testErc20TickerAndSupply();
        EV.ex5_testDenyListing();

        token.setTier(ev, 1);
        EV.ex3_testGetToken();
        EV.ex4_testBuyToken();
        EV.ex6_testAllowListing();

        token.setTier(ev, 0);
        EV.ex7_testDenyListing();

        token.setTier(ev, 1);
        EV.ex8_testTier1Listing();

        token.setTier(ev, 2);
        EV.ex9_testTier2Listing();
    }
}