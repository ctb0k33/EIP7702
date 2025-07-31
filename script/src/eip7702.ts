import { ethers } from "ethers";
import {PROVIDER, CHAIN_ID} from "./constant";

export async function checkDelegation(
 eoaAddress: string
): Promise<{ isDelegated: boolean; delegatedTo?: string }> {
 const code = await PROVIDER.getCode(eoaAddress);
 
 if (!code || code === '0x' || code.length === 0) {
   return { isDelegated: false };
 }
 
 // Check for EIP-7702 delegation prefix (0xef0100)
 if (code.toLowerCase().startsWith('0xef0100')) {
   // Extract the delegated address (remove 0xef0100 prefix)
   // The delegation designator format: 0xef0100 + contract_address (20 bytes)
   const delegatedAddress = '0x' + code.slice(8, 48); // Extract 20 bytes after 0xef0100
   return { isDelegated: true, delegatedTo: delegatedAddress };
 }
 
 return { isDelegated: false };
}


export async function signSponsorshipMessage(
  call: { data: string; to: string; value: bigint },
  sponsor: string,
  nonce: number,
  privateKey: string,
  chainId: number = CHAIN_ID
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  
  // CRITICAL: Match the contract's abi.encodePacked exactly
  // abi.encodePacked(chainId, to, value, keccak256(data), sponsor, nonce)
  const packedData = ethers.concat([
    ethers.toBeHex(chainId, 32),          // uint256 chainId (32 bytes)
    ethers.getAddress(call.to),           // address to (20 bytes, no padding)
    ethers.toBeHex(call.value, 32),       // uint256 value (32 bytes)
    ethers.keccak256(call.data),          // bytes32 keccak256(data) (32 bytes)
    ethers.getAddress(sponsor),           // address sponsor (20 bytes, no padding)
    ethers.toBeHex(nonce, 32)             // uint256 nonce (32 bytes)
  ]);
  
  const digest = ethers.keccak256(packedData);
  
  // Sign with Ethereum message prefix (matching contract's toEthSignedMessageHash)
  const signature = await wallet.signMessage(ethers.getBytes(digest));
  return signature;
}