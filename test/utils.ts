import { ethers } from "hardhat";

export const encodeBytes256String = (str: string): string[] => {
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

export const decodeBytes256String = (chunks: string[]): string => {
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
