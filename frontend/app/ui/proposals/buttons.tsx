import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteProposal } from "@/app/lib/actions";

export function UpdateProposal({ id }: { id: number }) {
  return (
    <Link href={`/proposals/${id}/edit`} className="rounded-md border p-1 hover:bg-gray-100">
      <PencilIcon className="w-5" />
    </Link>
  );
}

// export function DeleteProposal({ id }: { id: number }) {
//   return (
//     <Link href={`/proposals/${id}/delete`} className="rounded-md border p-1 hover:bg-gray-100">
//       <TrashIcon className="w-5" />
//     </Link>
//   );
// }

export function DeleteProposal({ id }: { id: number }) {
  const deleteProposalWithId = deleteProposal.bind(null, id);
  return (
    <form action={deleteProposalWithId}>
      <button type="submit" className="rounded-md border p-1 hover:bg-gray-100 hover:cursor-pointer">
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
