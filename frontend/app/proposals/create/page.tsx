import Form from "@/app/ui/proposals/create-form";
import Breadcrumbs from "@/app/ui/proposals/breadcrumbs";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Proposals", href: "/proposals" },
          {
            label: "Create Proposal",
            href: "/proposals/create",
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
