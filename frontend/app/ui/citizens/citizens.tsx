"use client";

import { useEffect, useState } from "react";
import { getCitizens } from "@/app/lib/contract";

export default function Proposals() {
  const [citizens, setCitizens] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const citizens = await getCitizens();
        setCitizens(citizens);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(`Error fetching citizens: ${error}`);
        } else {
          setErrorMessage("Error fetching citizens: An unknown error occurred.");
        }
      }
    })();
  }, [setCitizens]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {citizens?.map((address) => (
              <div key={address} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="mb-2 flex items-center">
                    <p>{address}</p>
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
              </tr>
            </thead>
            <tbody className="bg-white">
              {citizens?.map((address) => (
                <tr
                  key={address}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{address}</p>
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
