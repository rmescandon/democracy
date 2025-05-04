import { NewspaperIcon, PercentBadgeIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <form>
      {/* address */}
      <div className="mb-4">
        <label htmlFor="address" className="mb-2 block text-sm font-medium">
          Address
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <NewspaperIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address of the delegate"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
      {/* Percentage */}
      <div className="mb-4">
        <label htmlFor="percentage" className="mb-2 block text-sm font-medium">
          Percentage
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              id="amount"
              name="amount"
              type="number"
              step="1"
              placeholder="Percentage of representation of the delegate"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PercentBadgeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/proposals"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Register</Button>
        </div>
      </div>
    </form>
  );
}
