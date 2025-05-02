"use client";

import { ethers } from "ethers";
import { Account } from "@/app/lib/types";
import { Dispatch, useEffect, useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function MetaMask({
  account,
  setAccount,
}: {
  account: Account | null;
  setAccount: Dispatch<React.SetStateAction<Account | null>>;
}) {
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          doSetAccount(accounts[0]);
        }
      }
    };
    checkWalletConnection();
  }, [setAccount]);

  const doSetAccount = async (address: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const balance = await provider.getBalance(address);
    setAccount({
      address,
      balance: ethers.formatEther(balance),
      chainId: network.chainId.toString(),
      network: network.name,
    });
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // tracing in console whether connected
        console.log("Connected account:", accounts[0]);
        for (let i = 0; i < accounts.length; i++) {
          console.log("account: ", accounts[i]);
        }
        doSetAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    console.log("Disconnected");
  };

  if (account) {
    return (
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <div className="flex items-center">
          <Image
            src="/metamask-on.png"
            alt="metamask"
            className="mr-4 square-full bg-sky-100 hover:cursor-pointer"
            width={64}
            height={64}
            onClick={disconnectWallet}
          />
        </div>
        <div className="flex flex-col">
          <table className="w-full table-auto">
            <tbody>
              <tr>
                <td className="text-sm font-medium text-gray-500">Account:</td>
                <td className="text-sm text-gray-900">{account.address}</td>
              </tr>
              <tr>
                <td className="text-sm font-medium text-gray-500">Balance:</td>
                <td className="text-sm text-gray-900">{account.balance} ETH</td>
              </tr>
              <tr>
                <td className="text-sm font-medium text-gray-500">Network:</td>
                <td className="text-sm text-gray-900">{account.network}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
      <div className="flex items-center">
        <Image
          src="/metamask-off.svg"
          alt="metamask"
          className="mr-4 square-full bg-red-100 hover:cursor-pointer"
          width={64}
          height={64}
          onClick={connectWallet}
        />
      </div>
    </div>
  );
}
