import { proposals } from "@/app/lib/placeholder-data";

export default async function Proposals() {
  // Simulate a delay to mimic an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <main>
      <div className="mt-6">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="mb-4">
            <h2 className="text-xl font-semibold">{proposal.description}</h2>
            <p>Created at: {new Date(proposal.createdAt).toLocaleDateString()}</p>
            <p>Updated at: {new Date(proposal.updatedAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
