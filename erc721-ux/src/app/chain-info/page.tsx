"use client"; // uses state, effects and the wallet: must run in the browser

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { publicClient } from "@/lib/clients";
import { redirect } from "next/navigation";
import { chain } from "@/lib/config";

// The folder name is the URL: app/chain-info/page.tsx -> /chain-info
export default function ChainInfoPage() {
  const { account, chainId } = useWallet();
  
  const [blockNumber, setBlockNumber] = useState<bigint>();

  // viem polls the RPC and calls setBlockNumber on each new block.
  // watchBlockNumber returns an "unwatch" function: returning it from the
  // effect stops the polling when the user leaves the page.
  useEffect(
    () => publicClient.watchBlockNumber({ emitOnBegin: true, onBlockNumber: setBlockNumber }),
    [],
  );
if (chainId !== undefined && chainId !== chain.id) redirect("/wrong-network");
  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Chain info</h1>
      <p>
        Chain ID (wallet): <span className="font-mono">{chainId ?? "not connected"}</span>
      </p>
      <p>
        Latest block (Sepolia RPC): <span className="font-mono">{blockNumber?.toString() ?? "…"}</span>
      </p>
      <p>
        Address: <span className="font-mono text-sm">{account ?? "not connected"}</span>
      </p>
    </main>
  );
}
