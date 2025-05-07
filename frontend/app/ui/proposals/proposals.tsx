"use client";

import { useEffect, useState } from "react";
import { getProposals } from "@/app/lib/contract";
import { Proposal } from "@/app/lib/types";
import ProposalStatus from "@/app/ui/proposals/status";
import { VoteProposal, DeleteProposal, ProposalActionButton } from "@/app/ui/proposals/buttons";
import Link from "next/link";
import { HandThumbDownIcon, HandThumbUpIcon, PlusIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function Proposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const proposals = await getProposals();
        setProposals(proposals);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching proposals: ${error}`);
        } else {
          setErrorMessage("Error fetching proposals: An unknown error occurred.");
        }
      }
    })();
  }, [setProposals]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {proposals?.map((proposal) => (
              <div key={proposal.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{proposal.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{proposal.description}</p>
                  </div>
                  <ProposalStatus done={proposal.completed} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="text-xl font-medium justify-start">
                    <table>
                      <tbody>
                        <tr>
                          <td className="pr-2">
                            <HandThumbUpIcon className="h-5 w-5 text-white stroke-green-400" />
                          </td>
                          <td className="pr-4">{proposal.yesCount}</td>
                          <td className="pr-2">
                            <HandThumbDownIcon className="h-5 w-5 text-white stroke-red-400" />
                          </td>
                          <td className="pr-4">{proposal.noCount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ProposalActionButton proposal={proposal} callback={setProposals} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <HandThumbUpIcon className="h-5 w-5 text-white stroke-green-400" />
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <HandThumbDownIcon className="h-5 w-5 text-white stroke-red-400" />
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {proposals?.map((proposal) => (
                <tr
                  key={proposal.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{proposal.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{proposal.description}</td>
                  <td className="whitespace-nowrap px-4 py-3">{proposal.yesCount}</td>
                  <td className="whitespace-nowrap px-4 py-3">{proposal.noCount}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ProposalStatus done={proposal.completed} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ProposalActionButton proposal={proposal} callback={setProposals} />
                    </div>
                  </td>
                </tr>
              ))}
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
