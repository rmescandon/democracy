import { getDelegates, unregisterDelegate } from "@/app/lib/contract";
import { Dispatch, SetStateAction } from "react";
import { Delegate } from "@/app/lib/types";
import { TrashIcon } from "@heroicons/react/24/outline";

export function UnregisterDelegate({
  address,
  callback,
}: {
  address: string;
  callback: Dispatch<SetStateAction<Delegate[]>>;
}) {
  const handleUnregisterDelegate = async () => {
    await unregisterDelegate(address);
    const delegates = await getDelegates();
    callback(delegates);
  };

  return (
    <form action={handleUnregisterDelegate}>
      <button type="submit" className="rounded-md border p-1 hover:bg-gray-100 hover:cursor-pointer">
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
