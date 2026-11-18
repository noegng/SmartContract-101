"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { SubmitExercise } from "@/components/SubmitExercise";
import { Points } from "@/components/Points";

export default function Home() {
  const {
    account,
    hasWallet,
    isCorrectChain,
    connect,
    connectWalletConnect,
    wcQr,
    switchToSepolia,
    error,
  } = useWallet();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">TD ERC721 UX 101</h1>

      {!account ? (
        <section className="flex flex-col gap-3">
          {hasWallet && (
            <button onClick={connect} className="rounded-lg border px-4 py-2">
              Connect browser wallet
            </button>
          )}
          <button onClick={connectWalletConnect} className="rounded-lg border px-4 py-2">
            WalletConnect (QR code)
          </button>
          {wcQr && (
            <>
              <p className="text-sm">Scan with your mobile wallet:</p>
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL, nothing to optimise */}
              <img src={wcQr} alt="WalletConnect QR code" width={256} height={256} />
            </>
          )}
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <p>
            Connected: <span className="font-mono text-sm">{account}</span>
          </p>
          {!isCorrectChain ? (
            <button onClick={switchToSepolia} className="rounded-lg border px-4 py-2">
              Switch to Sepolia
            </button>
          ) : (
            <>
              <Points account={account} refreshKey={refreshKey} />
              <h2 className="text-lg font-medium">Setup: register this wallet</h2>
              <SubmitExercise account={account} onSubmitted={() => setRefreshKey((k) => k + 1)} />
            </>
          )}
        </section>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
