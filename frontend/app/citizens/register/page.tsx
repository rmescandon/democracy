"use client";

import MetaMask from "@/app/ui/metamask";
import { Account } from "@/app/lib/types";
import { useState } from "react";
import ErrorBoundary from "@/app/ui/error-boundary";
import RegisterForm from "@/app/ui/citizens/register-form";

export default function Page() {
  const [account, setAccount] = useState<Account | null>(null);
  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Register</h1>
      </div>
      <div className="flex w-full items-center justify-between">
        <MetaMask account={account} setAccount={setAccount} />
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <RegisterForm />
        </ErrorBoundary>
      </div>
    </main>
  );
}
