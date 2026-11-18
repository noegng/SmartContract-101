# Mission: Frontend dApp — TD ERC721 UX 101

## Why
Réussir le TD ERC721-UX-101 (Next.js + viem, Sepolia) en comprenant chaque exercice assez pour le refaire seul et l'expliquer au prof, pas juste récolter les points.

## Success looks like
- Expliquer et réécrire sans aide la connexion wallet via `window.ethereum` (EIP-1193) : `eth_requestAccounts`, `accountsChanged`, `chainChanged`, switch/add chain.
- Brancher WalletConnect v2 avec `@walletconnect/ethereum-provider` sans librairie de connecteur.
- Lire un contrat (`readContract`) et envoyer une transaction (`writeContract`, y compris payable) avec viem, et gérer pending / succès / revert.
- Créer les pages Next.js App Router demandées (`/chain-info`, `/fakeBayc/[tokenId]`, …) en sachant ce qui tourne côté client ou serveur.
- Appeler un minter avec une signature (FakeMeebits) en comprenant ce que la signature prouve.

## Constraints
- Deadline < 1 semaine : leçons très courtes, collées aux exercices du TD.
- Solidity déjà acquis (TD ERC20-101 et ERC721-101). Next.js App Router nouveau.
- Pas de wagmi / RainbowKit / Web3Modal dans la partie « Wallet Integration ».

## Out of scope
- Écrire ou déployer des contrats (déjà fait dans les TD précédents).
- Optimisations de prod (SSR avancé, caching, déploiement).
