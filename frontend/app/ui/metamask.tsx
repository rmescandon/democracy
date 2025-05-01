"use client";

import { ethers } from "ethers";
import { Account } from "@/app/lib/types";
import { useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function MetaMask() {
  const [account, setAccount] = useState<Account | null>(null);

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

        const address = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);
        setAccount({
          address,
          balance: ethers.formatEther(balance),
          chainId: network.chainId.toString(),
          network: network.name,
        });
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
      <div>
        <p>Account: {account.address}</p>
        <p>Balance: {account.balance} ETH</p>
        <p>Network: {account.network}</p>
        <Image
          src="/metamask-on.png"
          alt="metamask"
          className="mr-4 square-full hover:bg-red-100"
          width={64}
          height={64}
          onClick={disconnectWallet}
        />
      </div>
    );
  }
  return (
    <div>
      <Image
        src="metamask.svg"
        alt="metamask"
        className="mr-4 square-full hover:bg-sky-100"
        width={64}
        height={64}
        onClick={connectWallet}
      />
    </div>
  );
}
