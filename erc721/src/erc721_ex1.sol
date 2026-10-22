// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721_ex1 is ERC721Enumerable, Ownable {
    struct Animal {
        string name;
        bool wings;
        uint256 legs;
        uint256 sex;
    }

    mapping(uint256 => Animal) private animals;
    uint256 public nextTokenId = 1;

    mapping(address => bool) public breederList;
    uint256 public registrationPrice = 0.0001 ether;
    mapping(uint256 => uint256) public animalPrice;

    mapping(uint256 => uint256[2]) private parents;
    mapping(uint256 => uint256) public reproductionPrice;
    mapping(uint256 => address) public authorizedBreederToReproduce;


    event BreederListUpdated(address indexed user, bool allowed);

    modifier onlyAllowed() {
        require(breederList[msg.sender], "Not breeder allow-listed");
        _;
    }

    constructor(address evaluator) ERC721("ANImals", "ANIm") Ownable(msg.sender) {
        breederList[msg.sender] = true;
        _mint(evaluator, nextTokenId++); // token 1 → Evaluator
    }

    function isBreeder(address account) external view returns (bool) {
        return breederList[account];
    }

    function registerMeAsBreeder() external payable {
        require(msg.value == registrationPrice, "Wrong registration price");
        breederList[msg.sender] = true;
        emit BreederListUpdated(msg.sender, true);
    }

    function setBreederList(address user, bool allowed) external onlyOwner {
        breederList[user] = allowed;
        emit BreederListUpdated(user, allowed);
    }

    function mintAnimal(address to, string calldata name, bool wings, uint256 legs, uint256 sex) external onlyAllowed returns (uint256)
    {   
        return _createAnimal(to, name, wings, legs, sex);
    }

function declareAnimal(uint256 sex, uint256 legs, bool wings, string calldata name) external returns (uint256)
{
    require(breederList[msg.sender], "Only breeders can create new animals!");
    return _createAnimal(msg.sender, name, wings, legs, sex);
}

function declareDeadAnimal(uint256 animalNumber) external {
    require(ownerOf(animalNumber) == msg.sender, "Not your animal");
    delete animals[animalNumber];
    _burn(animalNumber);
}

function isAnimalForSale(uint256 animalNumber) external view returns (bool) {
    return animalPrice[animalNumber] > 0;
}

function offerForSale(uint256 animalNumber, uint256 price) external {
    require(ownerOf(animalNumber) == msg.sender, "Not your animal");
    require(price > 0, "Price must be positive");
    animalPrice[animalNumber] = price;
}

function buyAnimal(uint256 animalNumber) external payable {
    uint256 price = animalPrice[animalNumber];
    require(price > 0, "Animal not for sale");
    require(msg.value == price, "Wrong price");

    address seller = ownerOf(animalNumber);
    _transfer(seller, msg.sender, animalNumber);

    (bool ok, ) = payable(seller).call{value: msg.value}("");
    require(ok, "Payment failed");

}

function declareAnimalWithParents(uint256 sex, uint256 legs, bool wings, string calldata name, uint256 parent1, uint256 parent2) external onlyAllowed returns (uint256 tokenId)
{
    _useParent(parent1);
    _useParent(parent2);
    tokenId = _createAnimal(msg.sender, name, wings, legs, sex);
    parents[tokenId] = [parent1, parent2];
}

function getParents(uint256 animalNumber) external view returns (uint256, uint256) {
    return (parents[animalNumber][0], parents[animalNumber][1]);
}

function canReproduce(uint256 animalNumber) external view returns (bool) {
    return reproductionPrice[animalNumber] > 0;
}

function offerForReproduction(uint256 animalNumber, uint256 price) external returns (uint256) {
    require(ownerOf(animalNumber) == msg.sender, "Not your animal");
    require(price > 0, "Price must be positive");
    reproductionPrice[animalNumber] = price;
    return animalNumber;
}

function payForReproduction(uint256 animalNumber) external payable {
    uint256 price = reproductionPrice[animalNumber];
    require(price > 0, "Animal not available for reproduction");
    require(msg.value == price, "Wrong price");

    authorizedBreederToReproduce[animalNumber] = msg.sender;

    (bool ok, ) = payable(ownerOf(animalNumber)).call{value: msg.value}("");
    require(ok, "Payment failed");
}

// Un parent est utilisable si on en est propriétaire, ou si on a payé pour sa reproduction (droit à usage unique)
function _useParent(uint256 animalNumber) internal {
    if (ownerOf(animalNumber) == msg.sender) return;
    require(authorizedBreederToReproduce[animalNumber] == msg.sender, "Not allowed to breed this parent");
    delete authorizedBreederToReproduce[animalNumber];
}



function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
    delete animalPrice[tokenId]; // un animal qui change de main (ou meurt) n'est plus en vente
    delete reproductionPrice[tokenId];
    delete authorizedBreederToReproduce[tokenId];
    return super._update(to, tokenId, auth);
}

    function getAnimalCharacteristics(uint256 animalNumber) external view returns (string memory, bool, uint256, uint256)
    {
        Animal memory a = animals[animalNumber];
        return (a.name, a.wings, a.legs, a.sex);
    }

    function _createAnimal(address to, string calldata name, bool wings, uint256 legs, uint256 sex)
        internal
        returns (uint256 tokenId)
    {
        tokenId = nextTokenId++;
        animals[tokenId] = Animal(name, wings, legs, sex);
        _mint(to, tokenId);
    }
}
