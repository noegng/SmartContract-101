import { publicClient } from "./clients";
import { fakeBaycAbi } from "./abis";
import { FAKE_BAYC_ADDRESS } from "./config";

// FakeBAYC metadata has only image + attributes (no name, no description).
export type Metadata = { image: string; attributes: { trait_type: string; value: string }[] };

// Browsers can't open ipfs://, so go through an HTTP gateway.
export const toHttp = (uri: string) => uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

// contract tokenURI -> JSON URL -> metadata. Rejects if the token doesn't exist.
export async function fetchMetadata(tokenId: bigint): Promise<Metadata> {
  const uri = await publicClient.readContract({
    address: FAKE_BAYC_ADDRESS,
    abi: fakeBaycAbi,
    functionName: "tokenURI",
    args: [tokenId],
  });
  const res = await fetch(uri);
  return res.json();
}
