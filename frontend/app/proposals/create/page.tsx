"use client";

import Form from "@/app/ui/proposals/create-form";
import Breadcrumbs from "@/app/ui/proposals/breadcrumbs";
import MetaMask from "@/app/ui/metamask";
import { Account } from "@/app/lib/types";
import { useState } from "react";

export default function Page() {
  const [account, setAccount] = useState<Account | null>(null);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Proposals", href: "/proposals" },
          {
            label: "Create Proposal",
            href: "/proposals/create",
            active: true,
          },
        ]}
      />
      <MetaMask account={account} setAccount={setAccount} />
      <Form />
    </main>
  );
}
