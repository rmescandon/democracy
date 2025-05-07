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

export default function MetaMask() {
  const [account, setAccount] = useState<Account | null>(null);

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
      <div className="">
        <div className="flex flex-col">
          <div className="text-sm font-small text-gray-500 pt-2 pb-2">
            <Image
              src="/metamask-on.png"
              alt="metamask"
              className="mr-4 square-full bg-sky-100 hover:cursor-pointer"
              width={50}
              height={50}
              onClick={disconnectWallet}
            />
          </div>
          <div className="text-xs text-white">
            <div className="text-gray-400">Account:</div>
            <div>{account.address}</div>
            <div className="text-gray-400">Balance:</div>
            <div>{account.balance}</div>
            <div className="text-gray-400">Network:</div>
            <div>{account.network}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="flex flex-col">
        <div className="text-sm font-small text-gray-500 pt-2 pb-2">
          <Image
            src="/metamask-off.svg"
            alt="metamask"
            className="mr-4 square-full bg-red-100 hover:cursor-pointer"
            width={50}
            height={50}
            onClick={connectWallet}
          />
        </div>
        <div className="font-small text-white text-xs">Click on the fox icon to connect to Metamask</div>
      </div>
    </div>
  );
}
