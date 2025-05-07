import ErrorBoundary from "@/app/ui/error-boundary";
import RegisterCitizenForm from "@/app/ui/citizens/register-form";
import CitizenRegisteredAlert from "@/app/ui/citizens/events";

export default async function Page() {
  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Register</h1>
      </div>
      <div className="mt-6">
        <CitizenRegisteredAlert />
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <RegisterCitizenForm />
        </ErrorBoundary>
      </div>
    </main>
  );
}
