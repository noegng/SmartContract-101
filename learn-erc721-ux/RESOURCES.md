# Frontend dApp (TD ERC721 UX 101) Resources

## Knowledge

- [TD README — ERC721 UX 101 (Elli610/Blockchain-101)](https://github.com/Elli610/Blockchain-101/tree/main/workshops/solidity/erc721-ux-101)
  Énoncé officiel, liste des points, adresses Sepolia. Use for: savoir exactement ce qui est noté.
- [Evaluator.sol vérifié sur Sepolia Etherscan](https://sepolia.etherscan.io/address/0xe446502701fA5808DB07D817B00B660fB5EA6bFB#code)
  Source des checks automatiques. Use for: comprendre pourquoi un `exN_…` revert.
- [EIP-1193 : Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)
  La spec de `window.ethereum` : `request`, événements, codes d'erreur (4001, 4100, 4200, 4900, 4901). Use for: tout ce qui touche à la connexion wallet « from scratch ».
- [EIP-3326 : `wallet_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
  Paramètre `{ chainId: "0x…" }`, renvoie `null`. Use for: bouton Switch to Sepolia.
- [EIP-3085 : `wallet_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)
  Champs attendus pour ajouter un réseau. Use for: fallback quand le réseau est inconnu.
- [MetaMask docs : Manage networks](https://docs.metamask.io/wallet/how-to/manage-networks/add-network/)
  Table des erreurs courantes : 4902 (réseau non ajouté, spécifique MetaMask), 4001, -32002 (requête déjà en attente). Use for: gestion d'erreurs côté wallet.
- [Reown docs : Ethereum Provider (`@walletconnect/ethereum-provider`)](https://docs.reown.com/advanced/providers/ethereum)
  Provider WalletConnect v2 conforme EIP-1193 : `init` (projectId, optionalChains, rpcMap), `display_uri`, événements, session. `showQrModal` est deprecated (→ AppKit, interdit dans le TD). Use for: point WalletConnect.
- [viem docs](https://viem.sh/)
  `createPublicClient`, `readContract`, `simulateContract`, `writeContract`, `waitForTransactionReceipt`. Use for: lire/écrire les contrats du TD.
- Docs Next.js locales : `../erc721-ux/node_modules/next/dist/docs/`
  Docs de la version installée (Next 16), plus fiables que la mémoire. Use for: App Router, `"use client"`, routes dynamiques `[tokenId]`.

## Wisdom (Communities)

- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
  Q&A modéré, tags `metamask`, `viem`, `walletconnect`. Use for: bugs précis de provider ou de transaction.
- [viem GitHub Discussions](https://github.com/wevm/viem/discussions)
  Mainteneurs actifs. Use for: questions d'usage de viem.

## Gaps

- Rien pour l'instant.
