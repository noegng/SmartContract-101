# Provider EIP-1193 : pratiqué dans la console avec Rabby

L'utilisateur a fait la leçon 0001 et piloté son wallet à la main (`eth_chainId`, `chainChanged`, `wallet_switchEthereumChain`, `eth_accounts`). Il a remarqué tout seul que Rabby change de réseau sans popup, contrairement à ce qu'annonçait la leçon, et a dit avoir compris le reste.

**Evidence**: a observé `null` en retour et un changement automatique de réseau ; « le reste marche et j'ai compris ».

**Implications**: le comportement d'un wallet varie dans les limites du SHOULD de la spec ; toujours dire ce que garantit la spec et ce qui dépend du wallet. Le quiz n'a pas été rapporté : refaire 2-3 questions de 0001 en ouverture de la prochaine leçon (rappel espacé). Prochaine étape : WalletConnect v2 (point 2), qui attend le Project ID Reown.
