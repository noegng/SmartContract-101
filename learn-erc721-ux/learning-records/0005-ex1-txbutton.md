# Lecture/écriture viem : ex1 validé, props de TxButton à consolider

L'utilisateur a écrit seul la lecture `name`/`totalSupply` (en reprenant la solution de la leçon 0004) et a obtenu 4 points (ex1). Il a utilisé `<TxButton functionName="claimAToken" />` sans `label`/`account`/`address`/`abi` : l'erreur TS2739 était explicite mais il a demandé une correction plutôt que de la lire.

**Implications**: entraîner la lecture des erreurs TypeScript (« missing the following properties ») avant de corriger à sa place ; dans les prochains exercices, lui faire écrire les `TxButton` complets. Il connaît maintenant `refreshKey` comme dépendance d'effet pour relire après une transaction.
