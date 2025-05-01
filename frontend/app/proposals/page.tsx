import { Suspense } from "react";
import Proposals from "@/app/ui/proposal";
import { ProposalsSkeleton, MetaMaskSkeleton } from "@/app/ui/skeletons";
import MetaMask from "@/app/ui/metamask";

export default async function Page() {
  return (
    <main>
      <div className="mt-6">
        <Suspense fallback={<MetaMaskSkeleton />}>
          <MetaMask />
        </Suspense>
      </div>
      <h1 className="text-2xl font-bold">Proposals</h1>
      <p className="mt-4 text-gray-600">This is a list of proposals. Click on a proposal to view its details.</p>
      <div className="mt-6">
        <Suspense fallback={<ProposalsSkeleton />}>
          <Proposals />
        </Suspense>
      </div>
    </main>
  );
}
