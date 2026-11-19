"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { isAddress } from "viem";
import { publicClient } from "@/lib/clients";
import { fakeBaycAbi } from "@/lib/abis";
import { FAKE_BAYC_ADDRESS } from "@/lib/config";
import { fetchMetadata, toHttp } from "@/lib/fakeBayc";

// One card per token: fetches its own metadata, image loaded only when visible.
function TokenCard({ tokenId }: { tokenId: bigint }) {
  const [image, setImage] = useState<string>();

  useEffect(() => {
    fetchMetadata(tokenId)
      .then((meta) => setImage(toHttp(meta.image)))
      .catch(() => setImage(undefined));
  }, [tokenId]);

  return (
    <Link href={`/fakeBayc/${tokenId}`} className="flex flex-col items-center gap-1 rounded-lg border p-2">
      {image ? (
        // loading="lazy": the browser only downloads images near the viewport.
        // eslint-disable-next-line @next/next/no-img-element -- external IPFS image, no next/image config
        <img src={image} alt={`FakeBAYC #${tokenId}`} width={160} height={160} loading="lazy" />
      ) : (
        <div className="h-40 w-40 animate-pulse bg-gray-200" />
      )}
      <span className="font-mono text-sm">#{tokenId.toString()}</span>
    </Link>
  );
}

export default function GalleryPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const valid = isAddress(address);
  const [tokenIds, setTokenIds] = useState<bigint[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!valid) return;
    const contract = { address: FAKE_BAYC_ADDRESS, abi: fakeBaycAbi } as const;
    // balanceOf = how many tokens; tokenOfOwnerByIndex(owner, i) = the i-th one.
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
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">FakeBAYC gallery</h1>
      <p className="font-mono text-sm">{address}</p>
      {tokenIds.length === 0 ? (
        <p>This address owns no FakeBAYC.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {tokenIds.map((id) => (
            <TokenCard key={id.toString()} tokenId={id} />
          ))}
        </div>
      )}
    </main>
  );
}
