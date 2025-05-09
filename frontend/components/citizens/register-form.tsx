"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import Link from "next/link";
import { registerCitizen } from "@/app/lib/contract";

export default function RegisterCitizenForm() {
  const handleSubmit = async (formData: FormData) => {
    const address = formData.get("address") as string;
    await registerCitizen(address);
  };

  return (
    <form action={handleSubmit}>
      {/* address */}
      <div className="mb-4">
        <label htmlFor="address" className="mb-2 block text-sm font-medium">
          Address
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address of the citizen"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/citizens"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Back
          </Link>
          <Button type="submit">Register</Button>
        </div>
      </div>
    </form>
  );
}
