// Verified Evaluator ABI (Sepolia 0xe446…6bFB), functions only.
export const evaluatorAbi = [
  { type: "function", name: "submitExercise", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "ex1_claimedFakeBAYC", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "ex2_boughtFakeNefturians", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "ex3_claimedFakeMeebits", stateMutability: "nonpayable", inputs: [], outputs: [] },
  {
    type: "function",
    name: "hasSubmitted",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "exerciseProgression",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  { type: "function", name: "pointsERC20", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
  { type: "function", name: "fakeBAYC", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
  { type: "function", name: "fakeNefturians", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
  { type: "function", name: "fakeMeebits", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "address" }] },
] as const;

export const erc20Abi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;

// FakeBAYC (Sepolia 0x262f…91f5): ERC721Enumerable + a free claimAToken().
// Only the functions the TD needs; full verified ABI on Etherscan.
export const fakeBaycAbi = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "string" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ name: "", type: "uint256" }] },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  { type: "function", name: "claimAToken", stateMutability: "nonpayable", inputs: [], outputs: [] },
  { type: "function", name: "tokenURI", stateMutability: "view",
  inputs: [{ name: "tokenId", type: "uint256" }], outputs: [{ name: "", type: "string" }] },
  {
    type: "function",
    name: "tokenOfOwnerByIndex", // ERC721Enumerable: the owner's i-th token id
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
