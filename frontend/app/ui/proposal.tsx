"use client";

import { useEffect, useState } from "react";
import { getProposals } from "@/app/lib/contract";
import { Proposal } from "@/app/lib/types";

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  useEffect(() => {
    getProposals().then((proposals) => {
      setProposals(proposals);
    });
  }, [setProposals]);

  return (
    <main>
      <div className="mt-6">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="mb-4">
            <h2 className="text-xl font-semibold">{proposal.title}</h2>
            <p className="text-gray-600">{proposal.description}</p>
            <p className="text-gray-500">
              Votes: {proposal.yesCount} Yes / {proposal.noCount} No
            </p>
            <p className="text-gray-500">Status: {proposal.completed ? "Completed" : "In Progress"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
