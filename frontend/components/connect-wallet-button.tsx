"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { AlertTriangle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ConnectWalletButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick"> & {
  label?: string
  showIcon?: boolean
}

const hiddenProps = {
  "aria-hidden": true,
  style: {
    opacity: 0,
    pointerEvents: "none",
    userSelect: "none",
  } as React.CSSProperties,
}

export function ConnectWalletButton({
  label = "Connect Wallet",
  className,
  showIcon = true,
  ...buttonProps
}: ConnectWalletButtonProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Button
        type="button"
        {...buttonProps}
        className={cn("bg-yellow-500 text-black hover:bg-yellow-400", className)}
      >
        {showIcon && <Wallet className="size-4" />}
        <span>{label}</span>
      </Button>
    )
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted
        const connected = ready && !!account && !!chain
        const wrapperProps = ready ? undefined : hiddenProps

        if (!connected) {
          return (
            <div className="contents" {...wrapperProps}>
              <Button
                type="button"
                {...buttonProps}
                className={cn("bg-yellow-500 text-black hover:bg-yellow-400", className)}
                onClick={openConnectModal}
              >
                {showIcon && <Wallet className="size-4" />}
                <span>{label}</span>
              </Button>
            </div>
          )
        }

        if (chain?.unsupported) {
          return (
            <div className="contents" {...wrapperProps}>
              <Button type="button" variant="destructive" {...buttonProps} onClick={openChainModal}>
                <AlertTriangle className="size-4" />
                <span>Wrong network</span>
              </Button>
            </div>
          )
        }

        return (
          <div className="contents" {...wrapperProps}>
            <Button
              type="button"
              {...buttonProps}
              className={cn("bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30", className)}
              onClick={openAccountModal}
            >
              {showIcon && <Wallet className="size-4" />}
              <div className="flex flex-col text-left leading-tight">
                <span className="text-sm font-semibold">{account?.displayName ?? "Wallet"}</span>
                {account?.displayBalance ? (
                  <span className="text-xs text-yellow-200/80">{account.displayBalance}</span>
                ) : null}
              </div>
            </Button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
