import Link from "next/link";
import { StarIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getProposals, deleteProposal } from "@/app/lib/contract";
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
