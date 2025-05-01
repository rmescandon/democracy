import { Proposal } from "@/app/lib/types";
import { proposals } from "@/app/lib/placeholder-data";

export async function getProposal(id: string): Promise<Proposal | null> {
  const proposal = proposals.find((proposal) => proposal.id === id);
  if (!proposal) {
    return null;
  }
  return {
    id: proposal.id,
    description: proposal.description,
    completed: proposal.completed,
    createdAt: proposal.createdAt,
    updatedAt: proposal.updatedAt,
  };
}

export const getProposals = async (): Promise<Proposal[]> => {
  // Simulate a delay to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return proposals.map(({ id, description, completed, createdAt, updatedAt }) => ({
    id,
    description,
    completed,
    createdAt,
    updatedAt,
  }));
};
