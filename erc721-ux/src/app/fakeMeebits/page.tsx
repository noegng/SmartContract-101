"use client";
import { useEffect, useState } from "react";
import type { Hex } from "viem";
import { publicClient } from "@/lib/clients";
import { evaluatorAbi, fakeMeebitsClaimerAbi } from "@/lib/abis";
import { EVALUATOR_ADDRESS, FAKE_MEEBITS_CLAIMER_ADDRESS } from "@/lib/config";
import { TxButton } from "@/components/TxButton";
import { useWallet } from "@/hooks/useWallet";
// Copied from the TD repo: signatures/output-sig.json (one signature per token id).
import signatureFile from "@/lib/meebitsSignatures.json";

const signatures = signatureFile as { tokenNumber: number; signature: Hex }[];

export default function FakeMeebitsPage() {
  const { account } = useWallet();
  const [unclaimed, setUnclaimed] = useState<{ tokenNumber: number; signature: Hex }[]>();
  const [selected, setSelected] = useState<number>();
  const [refreshKey, setRefreshKey] = useState(0); // +1 after a claim -> re-read

  useEffect(() => {
    // One multicall = one RPC request for the 100 tokensThatWereClaimed(id) reads.
    publicClient
      .multicall({
        allowFailure: false,
        contracts: signatures.map((s) => ({
          address: FAKE_MEEBITS_CLAIMER_ADDRESS,
          abi: fakeMeebitsClaimerAbi,
          functionName: "tokensThatWereClaimed",
          args: [BigInt(s.tokenNumber)],
        })),
      })
      .then((claimed) => setUnclaimed(signatures.filter((_, i) => !claimed[i])));
  }, [refreshKey]);

  // Default to the first unclaimed token until the user picks one.
  const choice = unclaimed?.find((s) => s.tokenNumber === selected) ?? unclaimed?.[0];

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Fake Meebits</h1>

      {!unclaimed ? (
        <p>Loading unclaimed tokens…</p>
      ) : (
        <>
          <p>
            {unclaimed.length} / {signatures.length} tokens with a signature are still unclaimed.
          </p>
          <label className="flex items-center gap-2">
            Token id
            <select
              className="rounded border px-2 py-1"
              value={choice?.tokenNumber}
              onChange={(e) => setSelected(Number(e.target.value))}
            >
              {unclaimed.map((s) => (
                <option key={s.tokenNumber} value={s.tokenNumber}>
                  #{s.tokenNumber}
                </option>
              ))}
            </select>
          </label>
          {choice && (
            <p className="break-all font-mono text-xs">Signature: {choice.signature}</p>
          )}
        </>
      )}

      {!account ? (
        <p>Connect your wallet on the home page to claim.</p>
      ) : (
        <>
          {choice && (
            <TxButton
              label={`Claim FakeMeebit #${choice.tokenNumber}`}
              account={account}
              address={FAKE_MEEBITS_CLAIMER_ADDRESS}
              abi={fakeMeebitsClaimerAbi}
              functionName="claimAToken"
              args={[BigInt(choice.tokenNumber), choice.signature]}
              onSuccess={() => setRefreshKey((k) => k + 1)}
            />
          )}
          <TxButton
            label="Validate exercise 3"
            account={account}
            address={EVALUATOR_ADDRESS}
            abi={evaluatorAbi}
            functionName="ex3_claimedFakeMeebits"
          />
        </>
      )}
    </main>
  );
}
