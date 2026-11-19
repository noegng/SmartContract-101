# Route dynamique /fakeBayc/[tokenId] : implémentation déléguée

L'utilisateur a ajouté seul l'entrée `tokenURI` à `fakeBaycAbi` (correcte, déduite de `balanceOf`), puis a demandé que je remplisse `loading.tsx` et `page.tsx`. Il a donc vu le schéma ABI → `readContract` avec `args`, mais n'a pas encore écrit lui-même `use(params)`, la chaîne contrat → fetch JSON → `ipfs://` → gateway, ni l'état d'erreur.

**Implications**: avec la deadline courte, il privilégie l'avancement sur la pratique. Pour la galerie `[address]`, réutiliser ces mêmes notions (segment dynamique + `loading.tsx` + `tokenOfOwnerByIndex`) et lui proposer d'écrire au moins une partie, sans insister s'il délègue encore. Vérifier par 2-3 questions de rappel qu'il sait expliquer `use(params)` et `loading.tsx` au prof.
