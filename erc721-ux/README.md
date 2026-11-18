# TD ERC721 UX 101 — frontend

Next.js (App Router) + [viem](https://viem.sh), on Sepolia.

## Setup

```bash
cp .env.example .env.local   # then fill in the values
npm install
npm run dev                  # http://localhost:3000
```

| Variable | Where it is used |
| --- | --- |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia RPC used for reads (visible in the browser). |

The Evaluator address is in `src/lib/config.ts` ([0xe446…6bFB](https://sepolia.etherscan.io/address/0xe446502701fA5808DB07D817B00B660fB5EA6bFB)); the points token and NFT addresses are read from it.

## Architecture

- `src/lib/clients.ts`: `publicClient` (reads, via the Sepolia RPC) and `getWalletClient()` (writes, signed by the injected wallet).
- `src/hooks/useWallet.ts`: connect, current account and chain, switch to Sepolia, react to account and network changes.
- `src/components/SubmitExercise.tsx`: simulate, send, wait for receipt; shows the revert reason and an Etherscan link.
- `src/lib/abis.ts`: minimal ABIs, typed `as const` so viem infers argument and return types.
