"use client";

import { ethers } from "ethers";
import contractJson from "@/abi/Democracy.json";
import { Proposal } from "@/app/lib/types";

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = contractJson.abi;

const getContract = async ({ withSigner = false }: { withSigner: boolean } = { withSigner: false }) => {
  if (!contractAddress) {
    throw new Error("Contract address is not defined");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  }
  return new ethers.Contract(contractAddress, contractABI, provider);
};

const encodeBytes256String = (str: string): string[] => {
  // 1. Convert string to UTF-8 bytes
  const encoder = new TextEncoder();
  const inputBytes = encoder.encode(str);

  if (inputBytes.length > 256) {
    throw new Error("Input string is too long. Maximum length is 256 bytes.");
  }

  // 3. Split into 8 chunks of 32 bytes
  const chunks: string[] = [];
  for (let i = 0; i < 256; i += 32) {
    const chunk = inputBytes.slice(i, i + 32);
    const paddedChunk = new Uint8Array(32);
    paddedChunk.set(chunk);
    chunks.push(ethers.hexlify(paddedChunk)); // Convert to hex string
  }

  return chunks;
};

const decodeBytes256String = (chunks: string[]): string => {
  // 1. Process each chunk to remove padding and convert to bytes
  const byteArrays = chunks.map((chunk) => {
    const bytes = ethers.getBytes(chunk);

    // Remove trailing zeros from this 32-byte chunk
    let end = bytes.length;
    while (end > 0 && bytes[end - 1] === 0) end--;
    return bytes.slice(0, end);
  });

  // 2. Concatenate all non-padding bytes
  const totalLength = byteArrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  byteArrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.length;
  });

  // 3. Decode to UTF-8 string
  return new TextDecoder().decode(result);
};

// PUBLIC FUNCTIONS
// 1.- Proposals
export const createProposal = async ({ title, description }: { title: string; description: string }) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.createProposal(ethers.encodeBytes32String(title), encodeBytes256String(description));
  await tx.wait();
};

const getProposalById = async (contract: ethers.Contract, id: number): Promise<Proposal> => {
  const [title, description, yesCount, noCount, completed] = await contract.getProposal(id);
  return {
    id,
    title: ethers.decodeBytes32String(title),
    description: decodeBytes256String(description),
    yesCount,
    noCount,
    completed,
  };
};

export const getProposal = async (id: number): Promise<Proposal> => {
  const contract = await getContract();
  return await getProposalById(contract, id);
};

export const getProposals = async (): Promise<Proposal[]> => {
  const contract = await getContract();
  const count = await contract.proposalsCount();
  const proposals: Proposal[] = [];
  for (let i = 0; i < count; i++) {
    proposals.push(await getProposalById(contract, i));
  }
  return proposals;
};

export const deleteProposal = async (id: number) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.deleteProposal(id);
  await tx.wait();
};

export const finishVoting = async (id: number) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.finishVoting(id);
  await tx.wait();
};

export const voteAsCitizen = async (id: number, option: number) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.voteAsCitizen(id, option);
  await tx.wait();
};

export const listenToCitizenVoted = async (callback: (address: string, proposalId: number, option: number) => void) => {
  const contract = await getContract();
  contract.on("CitizenVoted", (address: string, proposalId: number, option: number) => {
    callback(address, proposalId, option);
  });
};

// 2.- Citizens
export const registerCitizen = async (address: string) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.registerCitizen(address);
  await tx.wait();
};

export const getCitizens = async (): Promise<string[]> => {
  const contract = await getContract();
  const count = await contract.citizensCount();
  const citizens: string[] = [];
  for (let i = 0; i < count; i++) {
    const citizen = await contract.getCitizen(i);
    citizens.push(citizen);
  }
  return citizens;
};

export const listenToCitizenRegistered = async (callback: (address: string) => void) => {
  const contract = await getContract();
  contract.on("CitizenRegistered", (address: string) => {
    callback(address);
  });
};

// 3.- Delegates
export const registerDelegate = async (address: string, percentage: number) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.registerDelegate(address, percentage);
  await tx.wait();
};

export const unregisterDelegate = async (address: string) => {
  const contract = await getContract({ withSigner: true });
  const tx = await contract.unregisterDelegate(address);
  await tx.wait();
};

export const getDelegates = async (): Promise<{ address: string; percentage: number }[]> => {
  const contract = await getContract();
  const count = await contract.delegatesCount();
  const delegates: { address: string; percentage: number }[] = [];
  for (let i = 0; i < count; i++) {
    const [address, percentage] = await contract.getDelegate(i);
    delegates.push({ address, percentage });
  }
  return delegates;
};

export const listenToDelegateRegistered = async (callback: (address: string, percentage: number) => void) => {
  const contract = await getContract();
  contract.on("DelegateRegistered", (address: string, percentage: number) => {
    callback(address, percentage);
  });
};

export const listenToDelegateUnregistered = async (callback: (address: string) => void) => {
  const contract = await getContract();
  contract.on("DelegateUnregistered", (address: string) => {
    callback(address);
  });
};
