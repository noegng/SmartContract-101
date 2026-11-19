"use client";
import { use, useEffect, useState } from "react";
import { isAddress } from "viem";
import { publicClient } from "@/lib/clients";
import { fakeNefturiansAbi } from "@/lib/abis";
import { FAKE_NEFTURIANS_ADDRESS } from "@/lib/config";

export default function NefturiansOfOwnerPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const valid = isAddress(address);
  const [tokenIds, setTokenIds] = useState<bigint[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!valid) return;
    const contract = { address: FAKE_NEFTURIANS_ADDRESS, abi: fakeNefturiansAbi } as const;
    // Same pattern as the FakeBAYC gallery: balanceOf, then tokenOfOwnerByIndex(i).
    publicClient
      .readContract({ ...contract, functionName: "balanceOf", args: [address] })
      .then((balance) =>
        Promise.all(
          Array.from({ length: Number(balance) }, (_, i) =>
            publicClient.readContract({
              ...contract,
              functionName: "tokenOfOwnerByIndex",
              args: [address, BigInt(i)],
            }),
          ),
        ),
      )
      .then(setTokenIds)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [address, valid]);

  if (!valid) return <main className="p-8">&quot;{address}&quot; is not a valid address.</main>;
  if (error) return <main className="p-8 text-red-600">{error}</main>;
  if (!tokenIds) return <main className="p-8">Loading…</main>;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">FakeNefturians</h1>
      <p className="font-mono text-sm">{address}</p>
      {tokenIds.length === 0 ? (
        <p>This address owns no FakeNefturians.</p>
      ) : (
        <ul className="list-disc pl-6 font-mono">
          {tokenIds.map((id) => (
            <li key={id.toString()}>#{id.toString()}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
