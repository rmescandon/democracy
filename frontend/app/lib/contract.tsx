"use client";

import { Contract, BrowserProvider } from "ethers";
import contractJson from "@/abi/Democracy.json";

// const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
const contractABI = contractJson.abi;

const getContract = async (rw: boolean = false) => {
  console.log("Contract address:", contractAddress);
  if (!contractAddress) {
    throw new Error("Contract address is not defined");
  }
  const provider = new BrowserProvider(window.ethereum);
  if (rw) {
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  }
  return new Contract(contractAddress, contractABI, provider);
};

export const createProposal = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}): Promise<number> => {
  const contract = await getContract(true);
  const tx = await contract.createProposal(title, description);
  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);
  return receipt;
};
