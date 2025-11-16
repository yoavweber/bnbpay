"use client"

import type { Abi } from "viem"

export const BNBPAY_PROCESSOR_ABI = [
  {
    type: "function",
    name: "processPayment",
    stateMutability: "payable",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "label", type: "string", internalType: "string" },
      { name: "memo", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
  },
  {
    type: "function",
    name: "processTokenPayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "token", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "label", type: "string", internalType: "string" },
      { name: "memo", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
  },
  {
    type: "function",
    name: "feePercentage",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
  },
] as const satisfies Abi

const DEFAULT_ADDRESSES: Record<number, `0x${string}`> = {
  97:
    (process.env.NEXT_PUBLIC_PROCESSOR_ADDRESS_BSC_TESTNET as `0x${string}`) ||
    "0x0000000000000000000000000000000000000000",
  56:
    (process.env.NEXT_PUBLIC_PROCESSOR_ADDRESS_BSC_MAINNET as `0x${string}`) ||
    "0x0000000000000000000000000000000000000000",
}

export function getProcessorAddress(chainId?: number) {
  if (chainId && DEFAULT_ADDRESSES[chainId]) {
    return DEFAULT_ADDRESSES[chainId]
  }

  return (process.env.NEXT_PUBLIC_PROCESSOR_ADDRESS as `0x${string}`) || DEFAULT_ADDRESSES[97]
}
