"use client";

import { useState } from "react";
import {
  BaseError,
  ContractFunctionRevertedError,
  type Abi,
  type Address,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type Hash,
} from "viem";
import { chain } from "@/lib/config";
import { getWalletClient, publicClient } from "@/lib/clients";

type Status =
  | { kind: "idle" }
  | { kind: "pending"; step: string; hash?: Hash }
  | { kind: "done"; hash: Hash }
  | { kind: "error"; message: string };

function errorMessage(e: unknown): string {
  if (e instanceof BaseError) {
    // Dig out the Solidity revert reason, e.g. "Evaluator: no FakeBAYC held".
    const revert = e.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      return revert.reason ?? revert.shortMessage;
    }
    return e.shortMessage;
  }
  return e instanceof Error ? e.message : String(e);
}

// Only functions that change state (nonpayable / payable) can be sent.
type WriteMutability = "nonpayable" | "payable";

// The generics tie functionName and args to the ABI you pass in:
// TypeScript rejects a function that isn't in the ABI, or wrong args.
type TxButtonProps<
  abi extends Abi,
  functionName extends ContractFunctionName<abi, WriteMutability>,
> = {
  label: string;
  account: Address;
  address: Address;
  abi: abi;
  functionName: functionName;
  args?: ContractFunctionArgs<abi, WriteMutability, functionName>;
  value?: bigint; // ETH (in wei) sent with a payable call
  disabled?: boolean;
  onSuccess?: () => void;
};

export function TxButton<
  const abi extends Abi,
  functionName extends ContractFunctionName<abi, WriteMutability>,
>({
  label,
  account,
  address,
  abi,
  functionName,
  args,
  value,
  disabled,
  onSuccess,
}: TxButtonProps<abi, functionName>) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function send() {
    const wallet = getWalletClient();
    if (!wallet) return setStatus({ kind: "error", message: "No wallet connected" });
    try {
      // 1. Simulate: a revert shows its reason before the wallet opens.
      setStatus({ kind: "pending", step: "Simulating…" });
      // Inside a generic component TypeScript can't check this call itself;
      // the props type above already guarantees it, hence the cast.
      const { request } = await publicClient.simulateContract({
        account,
        address,
        abi: abi as Abi,
        functionName: functionName as string,
        args: args as readonly unknown[] | undefined,
        value,
      });

      // 2. Send: the wallet asks the user to sign.
      setStatus({ kind: "pending", step: "Confirm in your wallet…" });
      const hash = await wallet.writeContract(request);

      // 3. Wait until the transaction is mined.
      setStatus({ kind: "pending", step: "Waiting for confirmation…", hash });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("Transaction reverted");

      setStatus({ kind: "done", hash });
      onSuccess?.();
    } catch (e) {
      setStatus({ kind: "error", message: errorMessage(e) });
    }
  }

  const explorer = chain.blockExplorers.default.url;
  const busy = status.kind === "pending";

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={send}
        disabled={busy || disabled}
        className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {busy ? status.step : label}
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
      {status.kind === "done" && <p className="text-green-600">Confirmed ✔</p>}
      {status.kind === "error" && <p className="text-red-600">{status.message}</p>}
    </div>
  );
}
