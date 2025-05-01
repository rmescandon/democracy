import Link from "next/link";
import { DocumentTextIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createProposal } from "@/app/lib/actions";

export default function Form() {
  return (
    <form action={createProposal}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <NewspaperIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title of the proposal"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/20 h-[18px] w-[18px] -translate-y-1/20 text-gray-500 peer-focus:text-gray-900" />
              <textarea
                id="description"
                name="description"
                rows={10}
                placeholder="Write an extended description with the details of the proposal"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/proposals"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Proposal</Button>
        </div>
      </div>
    </form>
  );
}
