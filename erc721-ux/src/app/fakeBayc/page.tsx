"use client";
import { useEffect, useState } from "react";
import { publicClient } from "@/lib/clients";
import { evaluatorAbi, fakeBaycAbi } from "@/lib/abis";
import { EVALUATOR_ADDRESS, FAKE_BAYC_ADDRESS } from "@/lib/config";
import { TxButton } from "@/components/TxButton";
import { useWallet } from "@/hooks/useWallet";

export default function FakeBaycPage() {
  const { account } = useWallet();
  const [name, setName] = useState<string>();
  const [supply, setSupply] = useState<bigint>();
  const [refreshKey, setRefreshKey] = useState(0); // +1 after a claim -> re-read

  useEffect(() => {
    const contract = { address: FAKE_BAYC_ADDRESS, abi: fakeBaycAbi } as const;
    publicClient.readContract({ ...contract, functionName: "name" }).then(setName);
    publicClient.readContract({ ...contract, functionName: "totalSupply" }).then(setSupply);
  }, [refreshKey]);

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">{name ?? "…"}</h1>
      <p>Total minted: {supply?.toString() ?? "…"}</p>

      {!account ? (
        <p>Connect your wallet on the home page to claim.</p>
      ) : (
        <>
          <TxButton
            label="Claim a FakeBAYC"
            account={account}
            address={FAKE_BAYC_ADDRESS}
            abi={fakeBaycAbi}
            functionName="claimAToken"
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />
          <TxButton
            label="Validate exercise 1"
            account={account}
            address={EVALUATOR_ADDRESS}
            abi={evaluatorAbi}
            functionName="ex1_claimedFakeBAYC"
          />
        </>
      )}
    </main>
  );
}
