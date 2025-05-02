"use client";

import { Contract, BrowserProvider, encodeBytes32String, decodeBytes32String, hexlify } from "ethers";
import contractJson from "@/abi/Democracy.json";
import { Proposal } from "@/app/lib/types";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = contractJson.abi;

const getContract = async ({ withSigner = false }: { withSigner: boolean } = { withSigner: false }) => {
  if (!contractAddress) {
    throw new Error("Contract address is not defined");
  }
  const provider = new BrowserProvider(window.ethereum);
  if (withSigner) {
    const signer = await provider.getSigner();
    return new Contract(contractAddress, contractABI, signer);
  }
  return new Contract(contractAddress, contractABI, provider);
};

export const createProposal = async ({ title, description }: { title: string; description: string }) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.createProposal(encodeBytes32String(title), description);
  await tx.wait();
};

export const getProposals = async (): Promise<Proposal[]> => {
  const contract = await getContract();
  console.log("Contract: ", contract);
  const count = await contract.proposalsCount();
  console.log("Count: ", count);
  const proposals: Proposal[] = [];
  for (let i = 0; i < count; i++) {
    const proposal = await contract.proposals(i);
    proposals.push({
      id: i,
      title: decodeBytes32String(proposal.title),
      description: proposal.description,
      yesCount: proposal.yesCount,
      noCount: proposal.noCount,
      completed: proposal.completed,
    });
  }
  console.log("Proposals: ", proposals);
  return proposals;
};
