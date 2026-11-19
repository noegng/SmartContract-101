"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { publicClient } from "@/lib/clients";
import { evaluatorAbi, fakeNefturiansAbi } from "@/lib/abis";
import { EVALUATOR_ADDRESS, FAKE_NEFTURIANS_ADDRESS } from "@/lib/config";
import { TxButton } from "@/components/TxButton";
import { useWallet } from "@/hooks/useWallet";

export default function FakeNefturiansPage() {
  const { account } = useWallet();
  const [name, setName] = useState<string>();
  const [price, setPrice] = useState<bigint>(); // in wei

  useEffect(() => {
    const contract = { address: FAKE_NEFTURIANS_ADDRESS, abi: fakeNefturiansAbi } as const;
    publicClient.readContract({ ...contract, functionName: "name" }).then(setName);
    // Read the price on-chain instead of hard-coding 0.001: it is a public variable.
    publicClient.readContract({ ...contract, functionName: "tokenPrice" }).then(setPrice);
  }, []);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">{name ?? "…"}</h1>
      <p>
        Price: <span className="font-mono">{price === undefined ? "…" : `${formatEther(price)} ETH`}</span>
      </p>

      {!account ? (
        <p>Connect your wallet on the home page to buy.</p>
      ) : (
        <>
          <TxButton
            label="Buy a FakeNefturian"
            account={account}
            address={FAKE_NEFTURIANS_ADDRESS}
            abi={fakeNefturiansAbi}
            functionName="buyAToken"
            value={price} // msg.value: the ETH sent with the call
            disabled={price === undefined}
          />
          <TxButton
            label="Validate exercise 2"
            account={account}
            address={EVALUATOR_ADDRESS}
            abi={evaluatorAbi}
            functionName="ex2_boughtFakeNefturians"
          />
          <Link href={`/fakeNefturians/${account}`} className="underline">
            My FakeNefturians
          </Link>
        </>
      )}
    </main>
  );
}
