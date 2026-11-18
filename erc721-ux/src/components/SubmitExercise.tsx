"use client";

import { useEffect, useState } from "react";
import { BaseError, ContractFunctionRevertedError, type Address, type Hash } from "viem";
import { evaluatorAbi } from "@/lib/abis";
import { EVALUATOR_ADDRESS, chain } from "@/lib/config";
import { getWalletClient, publicClient } from "@/lib/clients";

type Status =
  | { kind: "idle" }
  | { kind: "pending"; step: string; hash?: Hash }
  | { kind: "done"; hash: Hash }
  | { kind: "error"; message: string };

function errorMessage(e: unknown): string {
  if (e instanceof BaseError) {
    const revert = e.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      return revert.reason ?? revert.shortMessage;
    }
    return e.shortMessage;
  }
  return e instanceof Error ? e.message : String(e);
}

export function SubmitExercise({
  account,
  onSubmitted,
}: {
  account: Address;
  onSubmitted?: () => void;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
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
  }, [account, status.kind]);

  async function submit() {
    const wallet = getWalletClient();
    if (!wallet) return;
    try {
      // Simulate first so a revert shows its reason before MetaMask opens.
      setStatus({ kind: "pending", step: "Simulating…" });
      const { request } = await publicClient.simulateContract({
        account,
        address: EVALUATOR_ADDRESS,
        abi: evaluatorAbi,
        functionName: "submitExercise",
      });

      setStatus({ kind: "pending", step: "Confirm in your wallet…" });
      const hash = await wallet.writeContract(request);

      setStatus({ kind: "pending", step: "Waiting for confirmation…", hash });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("Transaction reverted");

      setStatus({ kind: "done", hash });
      onSubmitted?.();
    } catch (e) {
      setStatus({ kind: "error", message: errorMessage(e) });
    }
  }

  if (submitted && status.kind !== "done") {
    return <p className="text-green-600">This wallet is registered with the Evaluator ✔</p>;
  }

  const explorer = chain.blockExplorers.default.url;
  const busy = status.kind === "pending";

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={submit}
        disabled={busy || submitted === undefined}
        className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {busy ? status.step : "Call submitExercise()"}
      </button>
      {"hash" in status && status.hash && (
        <a
          href={`${explorer}/tx/${status.hash}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-sm underline"
        >
          {status.hash.slice(0, 10)}… on Etherscan
        </a>
      )}
      {status.kind === "done" && <p className="text-green-600">Submitted ✔</p>}
      {status.kind === "error" && <p className="text-red-600">{status.message}</p>}
    </div>
  );
}
