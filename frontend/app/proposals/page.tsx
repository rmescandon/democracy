"use client";

import Proposals from "@/app/ui/proposal";
import MetaMask from "@/app/ui/metamask";
import { Account } from "@/app/lib/types";
import { useState } from "react";

export default function Page() {
  const [account, setAccount] = useState<Account | null>(null);
  return (
    <main>
      <div className="mt-6">
        <MetaMask account={account} setAccount={setAccount} />
      </div>
      <h1 className="text-2xl font-bold">Proposals</h1>
      <p className="mt-4 text-gray-600">This is a list of proposals. Click on a proposal to view its details.</p>
      <div className="mt-6">
        <Proposals />
      </div>
    </main>
  );
}
