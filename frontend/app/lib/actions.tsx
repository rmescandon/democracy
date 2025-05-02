"use client";

import { z } from "zod";
import { createProposal as createProposalInContract } from "@/app/lib/contract";

const proposalFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(32, "Title must be less than 32 characters"),
  description: z.string().min(1, "Description is required").max(256, "Description must be less than 256 characters"),
});

export const createProposal = async (formData: FormData) => {
  // Use createContractProposal if needed
  const { title, description } = proposalFormSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  await createProposalInContract({ title, description });
};
