"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { getAddress, toHex, type Address, type EIP1193Provider } from "viem";
import { chain } from "@/lib/config";
import { getProvider, setWalletConnectProvider } from "@/lib/clients";

const noopSubscribe = () => () => {};

export function useWallet() {
  // false on the server, real value after hydration.
  const hasWallet = useSyncExternalStore(
    noopSubscribe,
    () => Boolean(window.ethereum),
    () => false,
  );
  const [account, setAccount] = useState<Address>();
  const [chainId, setChainId] = useState<number>();
  const [error, setError] = useState<string>();
  const [wcQr, setWcQr] = useState<string>(); // QR code image (data URL) while waiting for the phone

  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    const onAccounts = (accounts: readonly string[]) =>
      setAccount(accounts[0] ? getAddress(accounts[0]) : undefined);
    const onChain = (id: string) => setChainId(Number(id));

    // Restore an existing connection without prompting.
    provider.request({ method: "eth_accounts" }).then(onAccounts);
    provider.request({ method: "eth_chainId" }).then(onChain);

    provider.on("accountsChanged", onAccounts);
    provider.on("chainChanged", onChain);
    return () => {
      provider.removeListener("accountsChanged", onAccounts);
      provider.removeListener("chainChanged", onChain);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(undefined);
    const provider = window.ethereum;
    if (!provider) return setError("No injected wallet found. Connect Wallet.");
    try {
      // Opens the wallet popup; resolves with the authorised addresses.
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      setAccount(getAddress(accounts[0]));
      setChainId(Number(await provider.request({ method: "eth_chainId" })));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const connectWalletConnect = useCallback(async () => {
    setError(undefined);
    try {
      // Loaded only on click: the package is large and needs the browser.
      const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
      const { toDataURL } = await import("qrcode");

      const wc = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        optionalChains: [chain.id],
        rpcMap: { [chain.id]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL! },
        showQrModal: false, // the official modal is AppKit (forbidden): we draw our own QR
        metadata: {
          name: "TD ERC721 UX 101",
          description: "TD ERC721 UX 101 frontend",
          url: window.location.origin,
          icons: [],
        },
      });

      // 1. WalletConnect hands us a pairing URI ("wc:…"): we turn it into a QR code.
      wc.on("display_uri", (uri: string) => toDataURL(uri).then(setWcQr));
      // 2. Same EIP-1193 events as window.ethereum.
      wc.on("accountsChanged", (accounts: string[]) =>
        setAccount(accounts[0] ? getAddress(accounts[0]) : undefined),
      );
      wc.on("chainChanged", (id: string | number) => setChainId(Number(id)));
      wc.on("disconnect", () => {
        setWalletConnectProvider(undefined);
        setAccount(undefined);
      });

      // 3. Resolves once the phone has scanned the QR and approved.
      await wc.connect();
      setWcQr(undefined);
      setWalletConnectProvider(wc as unknown as EIP1193Provider);
      setAccount(getAddress(wc.accounts[0]));
      setChainId(wc.chainId);
    } catch (e) {
      setWcQr(undefined);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const switchToSepolia = useCallback(async () => {
    setError(undefined);
    const provider = getProvider();
    if (!provider) return;
    const chainIdHex = toHex(chain.id); // 11155111 -> "0xaa36a7"
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (e) {
      // 4902 = the wallet doesn't know this chain yet: add it (this also switches).
      if ((e as { code?: number }).code !== 4902) {
        return setError(e instanceof Error ? e.message : String(e));
      }
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainIdHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpcUrls.default.http],
              blockExplorerUrls: [chain.blockExplorers.default.url],
            },
          ],
        });
      } catch (e2) {
        setError(e2 instanceof Error ? e2.message : String(e2));
      }
    }
  }, []);

  return {
    account,
    chainId,
    hasWallet,
    isCorrectChain: chainId === chain.id,
    connect,
    connectWalletConnect,
    wcQr,
    switchToSepolia,
    error,
  };
}
