import { ethers } from "hardhat";

export const toBytes32 = (str: string): string => {
  return ethers.encodeBytes32String(str);
};

export const toBytes256 = (str: string): string[] => {
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
