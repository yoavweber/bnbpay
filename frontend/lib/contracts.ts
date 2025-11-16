"use client"

type NetworkConfig = {
  id: number
  name: string
  explorer: string
}

const NETWORKS: Record<number, NetworkConfig> = {
  97: {
    id: 97,
    name: "BNB Chain Testnet",
    explorer: "https://testnet.bscscan.com",
  },
  56: {
    id: 56,
    name: "BNB Chain",
    explorer: "https://bscscan.com",
  },
}

export function getNetwork(chainId?: number): NetworkConfig | undefined {
  if (!chainId) return NETWORKS[97]
  return NETWORKS[chainId]
}

export function getExplorerTxUrl(chainId: number, hash: string) {
  const network = getNetwork(chainId)
  return network ? `${network.explorer}/tx/${hash}` : ""
}
