"use client"; // useWallet = state + window.ethereum
import { redirect } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";


export default function WrongNetworkPage() {
    
  const { isCorrectChain, switchToSepolia, error } = useWallet();
  
  if (isCorrectChain) redirect("/chain-info"); // bonus
  return (
       <main className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Wrong network</h1>
      <p>This dApp only works on Sepolia.</p>
      <button onClick={switchToSepolia} className="rounded-lg border px-4 py-2">Switch to Sepolia</button>
      {error && <p className="text-red-600">{error}</p>}
    </main>
    
  );
  }