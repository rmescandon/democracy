import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function ProposalStatus({ done }: { done: boolean }) {
  return (
    <span
      className={clsx("inline-flex items-center rounded-full px-2 py-1 text-xs", {
        "bg-gray-100 text-gray-500": !done,
        "bg-green-500 text-white": done,
      })}
    >
      {!done ? (
        <>
          In Progress
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {done ? (
        <>
          Completed
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
