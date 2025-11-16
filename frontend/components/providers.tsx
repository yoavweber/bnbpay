"use client"

import "../lib/polyfills"

import { useEffect, useMemo, useState } from "react"
import type React from "react"
import "@rainbow-me/rainbowkit/styles.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider, createConfig, http } from "wagmi"
import { injected } from "wagmi/connectors"
import { bsc, bscTestnet } from "wagmi/chains"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID"
const SUPPORTED_CHAINS = [bscTestnet, bsc]

const createNoopStorage = () => ({
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
})

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
    [],
  )

  const [config] = useState(() => {
    const ssrStorage = typeof window === "undefined" ? createNoopStorage() : undefined
    return createConfig({
      chains: SUPPORTED_CHAINS,
      connectors: [injected({ shimDisconnect: true })],
      transports: {
        [bscTestnet.id]: http(),
        [bsc.id]: http(),
      },
      ssr: true,
      storage: ssrStorage as any,
    })
  })

  const [clientConfig, setClientConfig] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window === "undefined" || typeof indexedDB === "undefined") return

    Promise.all([
      import("@rainbow-me/rainbowkit").then((m) => m.getDefaultConfig),
      import("@rainbow-me/rainbowkit").then((m) => m.getDefaultWallets),
      import("@rainbow-me/rainbowkit/wallets").then((m) => m.braveWallet),
    ])
      .then(([getDefaultConfig, getDefaultWallets, braveWallet]) => {
        try {
          const { wallets: defaultWallets } = getDefaultWallets({
            appName: "Hacker House Protocol",
            projectId,
          })

          const walletsWithBrave = [
            ...defaultWallets,
            {
              groupName: "More",
              wallets: [(_params: unknown) => braveWallet()],
            },
          ]

          const updatedConfig = getDefaultConfig({
            appName: "Hacker House Protocol",
            projectId,
            chains: SUPPORTED_CHAINS,
            wallets: walletsWithBrave,
            ssr: true,
          })

          setClientConfig(updatedConfig)
        } catch (error) {
          console.error("Failed to initialize wallets:", error)
        }
      })
      .catch((error) => {
        console.error("Failed to load wallet modules:", error)
      })
  }, [])

  const activeConfig = isMounted && clientConfig ? clientConfig : config

  if (!isMounted) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={activeConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={activeConfig}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
