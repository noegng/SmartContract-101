import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type EIP1193Provider,
} from "viem";
import { mainnet } from "viem/chains";
import { chain } from "./config";

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

// Reads go straight to the RPC provider (the key is visible in the browser).
export const publicClient = createPublicClient({
  chain,
  transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
});

// ENS primary names live on Ethereum mainnet, not on Sepolia: this client is
// only used for ENS reads. http() without a URL uses viem's public mainnet RPC.
export const ensClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

// The wallet the app talks to: the injected one (Rabby, MetaMask) by default,
// or the WalletConnect provider once a QR-code connection is made.
// Both follow EIP-1193, so the rest of the code doesn't care which one it is.
let walletConnectProvider: EIP1193Provider | undefined;

export function setWalletConnectProvider(provider: EIP1193Provider | undefined) {
  walletConnectProvider = provider;
}

export function getProvider(): EIP1193Provider | undefined {
  if (walletConnectProvider) return walletConnectProvider;
  return typeof window === "undefined" ? undefined : window.ethereum;
}

// Writes are signed by the active wallet.
export function getWalletClient() {
  const provider = getProvider();
  if (!provider) return undefined;
  return createWalletClient({ chain, transport: custom(provider) });
}
