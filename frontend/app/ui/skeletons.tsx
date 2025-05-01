export function ProposalsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/6 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

export function MetaMaskSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-1/5 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
