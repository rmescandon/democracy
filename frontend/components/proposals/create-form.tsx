"use client";

import Link from "next/link";
import { DocumentTextIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { createProposal } from "@/app/lib/contract";
import { useRouter } from "next/navigation";
import { z } from "zod";

const proposalFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(32, "Title must be less than 32 characters"),
  description: z.string().min(1, "Description is required").max(256, "Description must be less than 256 characters"),
});

export default function CreateProposalForm() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const { title, description } = proposalFormSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
    });

    await createProposal({ title, description });
    router.push("/proposals");
  };

  return (
    <form action={handleSubmit}>
      <div>
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
