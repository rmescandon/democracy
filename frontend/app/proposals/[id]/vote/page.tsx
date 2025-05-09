import Breadcrumbs from "@/components/proposals/breadcrumbs";
import ErrorBoundary from "@/components/error-boundary";
import VoteProposalForm from "@/components/proposals/vote-form";
import Proposal from "@/components/proposals/proposal";
import { CitizenVotedAlert } from "@/components/proposals/events";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <Breadcrumbs
          breadcrumbs={[
            { label: "Proposals", href: "/proposals" },
            {
              label: "Vote",
              href: `/proposals/${id}/vote`,
              active: true,
            },
          ]}
        />
      </div>
      <div className="mt-6">
        <CitizenVotedAlert />
      </div>
      <div className="mt-6">
        <Proposal id={Number(id)} />
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <VoteProposalForm proposalId={Number(id)} />
        </ErrorBoundary>
      </div>
    </main>
  );
}
