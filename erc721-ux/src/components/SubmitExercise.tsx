"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";
import { evaluatorAbi } from "@/lib/abis";
import { EVALUATOR_ADDRESS } from "@/lib/config";
import { publicClient } from "@/lib/clients";
import { TxButton } from "./TxButton";

export function SubmitExercise({
  account,
  onSubmitted,
}: {
  account: Address;
  onSubmitted?: () => void;
}) {
  const [submitted, setSubmitted] = useState<boolean>();

  // The Evaluator reverts on a second call, so check first.
  useEffect(() => {
    let cancelled = false;
    publicClient
      .readContract({
        address: EVALUATOR_ADDRESS,
        abi: evaluatorAbi,
        functionName: "hasSubmitted",
        args: [account],
      })
      .then((value) => !cancelled && setSubmitted(value))
      .catch(() => !cancelled && setSubmitted(undefined));
    return () => {
      cancelled = true;
    };
  }, [account]);

  if (submitted) {
    return <p className="text-green-600">This wallet is registered with the Evaluator ✔</p>;
  }

  return (
    <TxButton
      label="Call submitExercise()"
      account={account}
      address={EVALUATOR_ADDRESS}
      abi={evaluatorAbi}
      functionName="submitExercise"
      disabled={submitted === undefined}
      onSuccess={() => {
        setSubmitted(true);
        onSubmitted?.();
      }}
    />
  );
}
