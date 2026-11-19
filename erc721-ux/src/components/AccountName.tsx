"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";
import { ensClient } from "@/lib/clients";

// Shows the address's primary ENS name (reverse resolution) if one is set,
// otherwise the raw hex address. The full address stays in the tooltip.
export function AccountName({ address }: { address: Address }) {
  const [ens, setEns] = useState<{ address: Address; name: string | null }>();

  useEffect(() => {
    let cancelled = false;
    ensClient
      .getEnsName({ address })
      .then((name) => !cancelled && setEns({ address, name }))
      .catch(() => !cancelled && setEns({ address, name: null })); // no ENS: fall back to hex
    return () => {
      cancelled = true;
    };
  }, [address]);

  // Ignore a result that belongs to a previous address (account switch).
  const name = ens?.address === address ? ens.name : null;

  return (
    <span title={address} className={name ? "font-semibold" : "font-mono text-sm"}>
      {name ?? address}
    </span>
  );
}
