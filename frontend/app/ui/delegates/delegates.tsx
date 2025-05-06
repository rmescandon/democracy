"use client";

import { useEffect, useState } from "react";
import { getDelegates } from "@/app/lib/contract";
import { Delegate } from "@/app/lib/types";
import { z } from "zod";

const proposalFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(32, "Title must be less than 32 characters"),
  description: z.string().min(1, "Description is required").max(256, "Description must be less than 256 characters"),
});

export default function Proposals() {
  const [delegates, setDelegates] = useState<Delegate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const delegates = await getDelegates();
        setDelegates(delegates);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching citizens: ${error}`);
        } else {
          setErrorMessage("Error fetching citizens: An unknown error occurred.");
        }
      }
    })();
  }, [setDelegates]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {delegates?.map((delegate) => (
              <div key={delegate.address} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="mb-2 flex items-center">
                    <p>{delegate.address}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="mb-2 flex items-center">
                    <p>{delegate.percentage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {delegates?.map((delegate) => (
                <tr
                  key={delegate.address}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{delegate.address}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{delegate.percentage}</p>
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
