// import { useEffect, useState } from "react";
// import { Proposal } from "@/app/lib/types";
import Breadcrumbs from "@/app/ui/proposals/breadcrumbs";
import ErrorBoundary from "@/app/ui/error-boundary";
import VoteProposalForm from "@/app/ui/proposals/vote-form";
import Proposal from "@/app/ui/proposals/proposal";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  //   const [proposal, setProposal] = useState<Proposal | null>(null);
  //   const [errorMessage, setErrorMessage] = useState<string>("");

  //   useEffect(() => {
  //     (async () => {
  //       try {
  //         const proposal = await getProposal(Number(id));
  //         setProposal(proposal);
  //       } catch (error) {
  //         if (error instanceof Error) {
  //           setErrorMessage(`Error fetching proposals: ${error}`);
  //         } else {
  //           setErrorMessage("Error fetching proposals: An unknown error occurred.");
  //         }
  //       }
  //     })();
  //   }, [setProposal]);

  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Proposals", href: "/proposals" },
            {
              label: "Vote Proposal",
              href: `/proposals/${id}/vote`,
              active: true,
            },
          ]}
        />
      </div>
      <div className="mt-6">
        <Proposal id={Number(id)} />
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <VoteProposalForm />
        </ErrorBoundary>
      </div>
    </main>
  );
}
