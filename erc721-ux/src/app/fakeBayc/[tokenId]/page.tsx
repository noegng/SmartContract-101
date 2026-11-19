"use client";
import { use, useEffect, useState } from "react";
import { publicClient } from "@/lib/clients";
import { fakeBaycAbi } from "@/lib/abis";
import { FAKE_BAYC_ADDRESS } from "@/lib/config";

// FakeBAYC metadata has only image + attributes (no name, no description).
type Metadata = { image: string; attributes: { trait_type: string; value: string }[] };

// Browsers can't open ipfs://, so go through an HTTP gateway.
const toHttp = (uri: string) => uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

export default function TokenPage({ params }: { params: Promise<{ tokenId: string }> }) {
  const { tokenId } = use(params); // always a string: "0", "42", "abc"…
  const [meta, setMeta] = useState<Metadata>();
  const [error, setError] = useState(false);

  useEffect(() => {
    // Promise.resolve() first, so that BigInt("abc") throwing lands in the same
    // .catch as a contract revert ("ERC721: invalid token ID").
    Promise.resolve()
      .then(() =>
        publicClient.readContract({
          address: FAKE_BAYC_ADDRESS,
          abi: fakeBaycAbi,
          functionName: "tokenURI",
          args: [BigInt(tokenId)],
        }),
      )
      .then((uri) => fetch(uri)) // contract -> JSON URL
      .then((res) => res.json()) // JSON URL -> metadata
      .then(setMeta)
      .catch(() => setError(true));
  }, [tokenId]);

  if (error) return <main className="p-8">Token #{tokenId} does not exist.</main>;
  if (!meta) return <main className="p-8">Loading…</main>;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">FakeBAYC #{tokenId}</h1>
      {/* eslint-disable-next-line @next/next/no-img-element -- external IPFS image, no next/image config */}
      <img src={toHttp(meta.image)} alt={`FakeBAYC #${tokenId}`} width={400} height={400} />
      <ul>
        {meta.attributes.map((a) => (
          <li key={a.trait_type}>
            {a.trait_type}: {a.value}
          </li>
        ))}
      </ul>
    </main>
  );
}
