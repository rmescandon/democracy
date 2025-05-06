"use client";

import { listenToDelegateRegistered, listenToDelegateUnregistered } from "@/app/lib/contract";
import { useEffect, useState } from "react";
import { Delegate } from "@/app/lib/types";

export const DelegateRegisteredAlert = () => {
  const [delegate, setDelegate] = useState<Delegate | null>(null);

  useEffect(() => {
    const handleDelegateRegistered = (address: string, percentage: number) => {
      setDelegate({ address, percentage });
    };

    listenToDelegateRegistered(handleDelegateRegistered);

    return () => {
      // Cleanup listener if needed
      setDelegate(null);
    };
  }, []);

  if (!delegate) return null;

  setTimeout(() => {
    setDelegate(null);
  }, 5000); // Clear the address (and the alert) after 5 seconds

  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      <svg
        className="shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">
          Citizen {delegate.address} registered with {delegate.percentage} percentage!
        </span>
      </div>
    </div>
  );
};

export const DelegateUnegisteredAlert = () => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const handleDelegateUnregistered = (address: string) => {
      setAddress(address);
    };

    listenToDelegateUnregistered(handleDelegateUnregistered);

    return () => {
      // Cleanup listener if needed
      setAddress(null);
    };
  }, []);

  if (!address) return null;

  setTimeout(() => {
    setAddress(null);
  }, 5000); // Clear the address (and the alert) after 5 seconds

  return (
    <div
      className="flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <svg
        className="shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className="font-medium">Delegate {address} unregistered!</span>
      </div>
    </div>
  );
};
