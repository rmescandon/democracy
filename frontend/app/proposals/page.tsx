import Proposals from "@/components/proposals/proposals";
// import Search from "@/app/ui/search";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ErrorBoundary from "@/components/error-boundary";

export default async function Page() {
  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Proposals</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <Search placeholder="Search proposals..." /> */}
        <Link
          href="/proposals/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Create Proposal</span> <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <Proposals />
        </ErrorBoundary>
      </div>
    </main>
  );
}
