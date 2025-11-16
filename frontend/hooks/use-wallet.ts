"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useAccount, useConnect, useDisconnect, useReconnect } from "wagmi"
import { useConnectModal } from "@rainbow-me/rainbowkit"

const SESSION_STORAGE_KEY = "hhp_wallet_connected"

type ConnectedWalletSummary = {
  address: `0x${string}`
  connectorName?: string
  connectorId?: string
}

export function useWallet() {
  const { address, connector, isConnected, status } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { reconnectAsync } = useReconnect()

  const [hasConnectedThisSession, setHasConnectedThisSession] = useState(false)
  const connectAttemptRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const hasSessionFlag = sessionStorage.getItem(SESSION_STORAGE_KEY) === "true"
    setHasConnectedThisSession(hasSessionFlag)
    connectAttemptRef.current = hasSessionFlag
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (isConnected && address) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true")
      setHasConnectedThisSession(true)
      connectAttemptRef.current = true
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      setHasConnectedThisSession(false)
      connectAttemptRef.current = false
    }
  }, [isConnected, address])

  const reconnectWallet = useCallback(async () => {
    try {
      await reconnectAsync()
    } catch (error) {
      console.error("Failed to reconnect wallet:", error)
      throw error
    }
  }, [reconnectAsync])

  const connectWallet = useCallback(async () => {
    if (isConnected) return
    if (hasConnectedThisSession) {
      await reconnectWallet()
      return
    }
    if (connectAttemptRef.current) return
    connectAttemptRef.current = true

    try {
      if (openConnectModal) {
        openConnectModal()
      } else if (connectors[0]) {
        await connectAsync({ connector: connectors[0] })
      } else {
        throw new Error("No wallet connectors available")
      }
    } catch (error) {
      connectAttemptRef.current = false
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }, [connectAsync, connectors, hasConnectedThisSession, isConnected, openConnectModal, reconnectWallet])

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnectAsync()
      connectAttemptRef.current = false
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(SESSION_STORAGE_KEY)
        setHasConnectedThisSession(false)
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
      throw error
    }
  }, [disconnectAsync])

  const walletAddress = address ?? null
  const connectedWallet: ConnectedWalletSummary | null = useMemo(() => {
    if (!walletAddress) return null
    return {
      address: walletAddress as `0x${string}`,
      connectorName: connector?.name,
      connectorId: connector?.id,
    }
  }, [walletAddress, connector?.id, connector?.name])

  return {
    walletAddress,
    connectedWallet,
    isConnected,
    status,
    hasConnectedThisSession,
    connectWallet,
    reconnectWallet,
    disconnectWallet,
  }
}
