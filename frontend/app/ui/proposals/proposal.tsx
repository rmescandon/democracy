"use client";

import { useEffect, useState } from "react";
import { getProposal } from "@/app/lib/contract";
import { Proposal as ProposalType } from "@/app/lib/types";

export default function Proposal({ id }: { id: number }) {
  const [proposal, setProposal] = useState<ProposalType>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const proposal = await getProposal(id);
        setProposal(proposal);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching proposals: ${error}`);
        } else {
          setErrorMessage("Error fetching proposals: An unknown error occurred.");
        }
      }
    })();
  }, [setProposal]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <div className="mb-2 w-full rounded-md bg-white p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="mb-2 flex items-center">
                    <p>{proposal?.title}</p>
                  </div>
                  <p className="text-sm text-gray-500">{proposal?.description}</p>
                </div>
              </div>
            </div>
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <tbody className="bg-white">
              <tr className="w-full border-b py-3 text-md last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <p>{proposal?.title}</p>
                  </div>
                </td>
              </tr>
              <tr className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex items-center gap-3">
                    <p>{proposal?.description}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {errorMessage && (
        <div>
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
