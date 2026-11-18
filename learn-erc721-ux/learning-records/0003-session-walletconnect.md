# WalletConnect : la session limite ce que la page peut demander

L'utilisateur a branché WalletConnect et a rencontré « Missing or invalid. request() method: wallet_addEthereumChain ». Explication donnée à partir du code source : le SDK refuse localement toute méthode ou chaîne absente des namespaces acceptés par le wallet ; `optionalChains` peut être ignoré par le wallet (Rabby mobile n'a pas Sepolia sans réseau custom). Il a clos la partie « Wallet Integration ».

**Implications**: ne pas re-enseigner le provider EIP-1193 ni WalletConnect ; s'y appuyer. Prochain sujet : Chain Detection (`/chain-info`), première vraie route Next.js App Router — c'est là que « Next.js nouveau » (LR-0001) entre en jeu : expliquer `"use client"` et le dossier `app/chain-info/page.tsx`.
