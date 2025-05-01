import { Contract, BrowserProvider, JsonRpcSigner } from "ethers";
import contractJson from "@/abi/Democracy.json";
import { read } from "fs";

const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = contractJson.abi;

export const getContract = async (rw: boolean = false) => {
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
