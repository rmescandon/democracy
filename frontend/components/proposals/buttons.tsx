import Link from "next/link";
import { LockClosedIcon, StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getProposals, deleteProposal, finishVoting } from "@/app/lib/contract";
import { Dispatch, SetStateAction } from "react";
import { Proposal } from "@/app/lib/types";

export function VoteProposal({ id }: { id: number }) {
  return (
    <Link href={`/proposals/${id}/vote`} className="rounded-md border p-1 hover:bg-gray-100">
      <StarIcon className="w-5" />
    </Link>
  );
}

export function DeleteProposal({ id, callback }: { id: number; callback: Dispatch<SetStateAction<Proposal[]>> }) {
  const handleDeleteProposal = async () => {
    await deleteProposal(id);
    const proposals = await getProposals();
    callback(proposals);
  };

  return (
    <form action={handleDeleteProposal}>
      <button type="submit" className="rounded-md border p-1 hover:bg-gray-100 hover:cursor-pointer">
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function FinishVoting({ id, callback }: { id: number; callback: Dispatch<SetStateAction<Proposal[]>> }) {
  const handleFinishVoting = async () => {
    await finishVoting(id);
    const proposals = await getProposals();
    callback(proposals);
  };

  return (
    <form action={handleFinishVoting}>
      <button type="submit" className="rounded-md border p-1 hover:bg-gray-100 hover:cursor-pointer">
        <LockClosedIcon className="w-5" />
      </button>
    </form>
  );
}

export function ProposalActionButton({
  proposal,
  callback,
}: {
  proposal: Proposal;
  callback: Dispatch<SetStateAction<Proposal[]>>;
}) {
  if (proposal.completed) {
    return <div />;
  }

  return (
    <div className="flex justify-end gap-2">
      <VoteProposal id={proposal.id} />
      {proposal.yesCount + proposal.noCount > 0 ? (
        <div className="flex items-center gap-2">
          <FinishVoting id={proposal.id} callback={callback} />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <DeleteProposal id={proposal.id} callback={callback} />
        </div>
      )}
    </div>
  );
}
