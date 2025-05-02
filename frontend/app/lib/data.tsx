import { Proposal } from "@/app/lib/types";
import { proposals } from "@/app/lib/placeholder-data";

export async function getProposal(id: number): Promise<Proposal | null> {
  const proposal = proposals.find((proposal) => proposal.id === id);
  if (!proposal) {
    return null;
  }
  return {
    id: proposal.id,
    title: proposal.title,
    description: proposal.description,
    completed: proposal.completed,
    yesCount: proposal.yesCount,
    noCount: proposal.noCount,
  };
}

export const getProposals = async () => {
  // Simulate a delay to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return proposals.map(({ id, title, description, yesCount, noCount, completed }) => ({
    id,
    title,
    description,
    yesCount,
    noCount,
    completed,
  }));
};
