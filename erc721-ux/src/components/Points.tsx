"use client";

import { useEffect, useState } from "react";
import { formatUnits, type Address } from "viem";
import { erc20Abi, evaluatorAbi } from "@/lib/abis";
import { EVALUATOR_ADDRESS } from "@/lib/config";
import { publicClient } from "@/lib/clients";

export function Points({ account, refreshKey }: { account: Address; refreshKey: number }) {
  const [points, setPoints] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    publicClient
      .readContract({ address: EVALUATOR_ADDRESS, abi: evaluatorAbi, functionName: "pointsERC20" })
      .then((token) =>
        Promise.all([
          publicClient.readContract({ address: token, abi: erc20Abi, functionName: "balanceOf", args: [account] }),
          publicClient.readContract({ address: token, abi: erc20Abi, functionName: "decimals" }),
        ]),
      )
      .then(([balance, decimals]) => !cancelled && setPoints(formatUnits(balance, decimals)))
      .catch(() => !cancelled && setPoints("error"));
    return () => {
      cancelled = true;
    };
  }, [account, refreshKey]);

  return (
    <p>
      TD-ERC721-UX-101 points: <span className="font-mono">{points ?? "…"}</span>
    </p>
  );
}
