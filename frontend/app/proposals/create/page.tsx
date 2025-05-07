"use client";

import Form from "@/app/ui/proposals/create-form";
import Breadcrumbs from "@/app/ui/proposals/breadcrumbs";
import { Account } from "@/app/lib/types";
import { useState } from "react";
import ErrorBoundary from "@/app/ui/error-boundary";

export default function Page() {
  const [account, setAccount] = useState<Account | null>(null);
  return (
    <main>
      <div className="flex w-full items-center justify-between">
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
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <Form />
        </ErrorBoundary>
      </div>
    </main>
  );
}
