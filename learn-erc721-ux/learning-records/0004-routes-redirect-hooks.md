# Routes App Router et redirection : écrites par l'utilisateur

L'utilisateur a écrit seul `/wrong-network` et la redirection depuis `/chain-info` (`redirect()` pendant le rendu, garde `chainId !== undefined`, bonus retour vers `/chain-info`) et validé les 3 étapes avec Rabby. Correction donnée : il avait placé `redirect()` entre deux hooks ; règle « tous les hooks d'abord, les sorties ensuite » (Rules of Hooks), que le lint ne détecte pas ici.

**Implications**: il sait créer une route et choisir `"use client"`. Pour `/fakeBayc`, le laisser écrire les lectures/écritures en s'inspirant de `Points.tsx` / `SubmitExercise.tsx` ; surveiller l'ordre des hooks. Prochain nouveau concept : segment dynamique `[tokenId]`.
