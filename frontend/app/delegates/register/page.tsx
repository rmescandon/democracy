import ErrorBoundary from "@/components/error-boundary";
import RegisterDelegateForm from "@/components/delegates/register-form";
import { DelegateRegisteredAlert } from "@/components/delegates/events";

export default async function Page() {
  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Register</h1>
      </div>
      <div className="mt-6">
        <DelegateRegisteredAlert />
      </div>
      <div className="mt-6">
        <ErrorBoundary>
          <RegisterDelegateForm />
        </ErrorBoundary>
      </div>
    </main>
  );
}
