# Notes

- Langue : français.
- « Fais le moins possible à chaque étape et dis-moi exactement ce que tu fais » : une seule petite modification par étape, expliquée ligne par ligne. Pas d'« usine à gaz » (pas de proxy, pas d'abstraction non demandée).
- Le code du TD est dans `../erc721-ux/` (noté par le prof) ; l'espace d'apprentissage est ici, séparé.
- État du projet au 2026-11-18 : scaffold Next 16 + viem fait ; `useWallet.ts` fait `eth_requestAccounts`, écoute `accountsChanged`/`chainChanged`, switch Sepolia avec fallback 4902 → `wallet_addEthereumChain`. RPC Alchemy : l'URL pointait sur mainnet, à corriger par l'utilisateur. WalletConnect : fait (QR dessiné via `display_uri` + `qrcode`, provider actif via `getProvider()` dans `clients.ts`). `submitExercise()` pas encore appelé.
- Wallet : **Rabby** (pas MetaMask). Rabby fait `wallet_switchEthereumChain` vers un réseau connu sans popup. Avant d'enseigner un comportement « MetaMask » (codes 4902/-32002, popups), vérifier ce que fait Rabby.
- 2026-11-18 : partie « Wallet Integration » terminée (points 1, 2, 3). Rabby mobile n'a pas Sepolia par défaut (réseau custom à ajouter) ; erreur rencontrée « Missing or invalid. request() method: wallet_addEthereumChain » = méthode absente de la session WalletConnect. Rien n'est encore commité.
- Next 16 du projet : `cacheComponents: true` + `partialPrefetching: true`. Toute route dynamique (`[tokenId]`, `[address]`) qui lit `params` doit avoir un `loading.tsx` (ou un `<Suspense>`), sinon erreur `blocking-prerender-dynamic`. Pinata gateway : ~5 s par image.
- 2026-11-19 : partie FakeBAYC terminée (/fakeBayc, claim, ex1 = 4 pts, /fakeBayc/[tokenId], /fakeBayc/gallery/[address]). L'utilisateur a délégué l'écriture des deux pages dynamiques. Helper partagé `src/lib/fakeBayc.ts` (Metadata, toHttp, fetchMetadata). Suite : FakeNefturians (payable, `value`).
