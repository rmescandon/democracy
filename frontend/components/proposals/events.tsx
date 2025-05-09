"use client";

import { listenToCitizenVoted } from "@/app/lib/contract";
import { useEffect, useState } from "react";
import { Vote } from "@/app/lib/types";

export const CitizenVotedAlert = () => {
  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => {
    const handleCitizenVoted = (address: string, proposalId: number, option: number) => {
      // TODO TRACE
      console.log("CitizenVoted", address, proposalId, option);
      setVote({ address, proposalId, option: option as 0 | 1 | 2 });
    };

    listenToCitizenVoted(handleCitizenVoted);

    return () => {
      // Cleanup listener if needed
      setVote(null);
    };
  }, []);

  if (!vote) return null;

  setTimeout(() => {
    setVote(null);
  }, 5000); // Clear alert after 5 seconds

  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      <svg
        className="shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">
          Citizen {vote.address} voted the proposal {vote.proposalId} with option{" "}
          {vote.option === 0 ? "abstain" : vote.option === 1 ? "yes" : "no"}!
        </span>
      </div>
    </div>
  );
};
