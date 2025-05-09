"use server";
import CreateProposalForm from "@/components/proposals/create-form";
import Breadcrumbs from "@/components/proposals/breadcrumbs";
import ErrorBoundary from "@/components/error-boundary";

export default async function Page() {
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
          <CreateProposalForm />
        </ErrorBoundary>
      </div>
    </main>
  );
}
