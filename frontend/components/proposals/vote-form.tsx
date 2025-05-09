"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { voteAsCitizen } from "@/app/lib/contract";
import Link from "next/link";

export default function VoteProposalForm({ proposalId }: { proposalId: number }) {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleClick = async (buttonId: string) => {
    let option = 0;
    switch (buttonId) {
      case "yes":
        option = 1;
        break;
      case "no":
        option = 2;
        break;
    }

    try {
      await voteAsCitizen(proposalId, option);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Error voting: ${error.message}`);
      } else {
        setErrorMessage("Error voting: An unknown error occurred.");
      }
    }
  };

  return (
    <form>
      <div className="mt-6 flex justify-end gap-4">
        <Button className="bg-green-400 hover:bg-green-300" type="button" onClick={() => handleClick("yes")}>
          Yes
        </Button>
        <Button className="bg-red-400 hover:bg-red-300" type="button" onClick={() => handleClick("no")}>
          No
        </Button>
        <Button className="bg-gray-400 hover:bg-gray-300" type="button" onClick={() => handleClick("abstain")}>
          Abstain
        </Button>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/proposals"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
      </div>
      {errorMessage && (
        <div>
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </form>
  );
}
