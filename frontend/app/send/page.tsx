"use client"

import { Suspense, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BNBPAY_PROCESSOR_ABI, getProcessorAddress } from "@/lib/contract"
import { getExplorerTxUrl, getNetwork } from "@/lib/contracts"
import { shortenAddress } from "@/lib/utils"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Loader2, CheckCircle2, XCircle, ArrowLeft, Send, AlertCircle, CloudCog } from "lucide-react"
import { Toaster, toast } from "sonner"

function SendPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const chainId = useChainId()
  const { isConnected, address } = useAccount()
  const { writeContract, data: hash, error, isPending, status } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
  })

  const processorAddress = getProcessorAddress(chainId)
  const network = getNetwork(chainId)

  const paymentDetails = useMemo(
    () => ({
      to: searchParams.get("to") || "",
      amount: searchParams.get("amount") || "",
      token: (searchParams.get("token") || "BNB") as "BNB" | "USDC" | "USDT",
      label: searchParams.get("label") || "",
      memo: searchParams.get("memo") || "",
    }),
    [searchParams],
  )

  useEffect(() => {
    if (error) {
      console.error("Payment error:", error)
      toast.error(`Error: ${error.message}`)
    }
  }, [error])

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success("Payment sent successfully!")
      setTimeout(() => {
        router.push(
          `/send/success?tx=${hash}&to=${paymentDetails.to}&amount=${paymentDetails.amount}&token=${paymentDetails.token}`,
        )
      }, 2000)
    }
  }, [isSuccess, hash, paymentDetails, router])

  const handleSendPayment = async () => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet first")
      return
    }
    console.log(chainId, "what is my chain id")
    if (chainId !== 97) {
      toast.error("Please switch to BNB Chain (Testnet or Mainnet)")
      return
    }

    if (!paymentDetails.to || !paymentDetails.amount) {
      toast.error("Invalid payment details")
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(paymentDetails.to)) {
      toast.error("Invalid recipient address")
      return
    }

    try {
      const amountInWei = parseEther(paymentDetails.amount)

      if (paymentDetails.token === "BNB") {
        writeContract({
          address: processorAddress,
          abi: BNBPAY_PROCESSOR_ABI,
          functionName: "processPayment",
          args: [paymentDetails.to as `0x${string}`, paymentDetails.label || "Payment", paymentDetails.memo || ""],
          value: amountInWei,
        })
      } else {
        toast.error("Token payments coming soon!")
      }
    } catch (err) {
      console.error("Error initiating payment:", err)
      toast.error("Failed to initiate payment")
    }
  }

  const isValidRequest = Boolean(paymentDetails.to && paymentDetails.amount)
  const explorerTxUrl = hash && network ? getExplorerTxUrl(chainId, hash) : ""

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" />
      <div className="mx-auto max-w-2xl px-4 py-8 pt-24">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Complete Payment</h1>
          <p className="text-muted-foreground">Review and send your payment</p>
        </div>

        {!isValidRequest ? (
          <Card className="glass border border-white/10 p-12 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/20">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Invalid Payment Link</h3>
            <p className="mb-6 text-muted-foreground">This payment link is invalid or expired</p>
            <Link href="/dashboard">
              <Button>Create New Payment Link</Button>
            </Link>
          </Card>
        ) : (
          <Card className="glass space-y-6 border border-white/10 p-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold">Payment Details</h2>
              <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{paymentDetails.amount}</div>
                    <Badge className="mt-2 bg-primary/20 text-primary"> {paymentDetails.token} </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-mono text-sm">{shortenAddress(paymentDetails.to)}</span>
                </div>

                {paymentDetails.label && (
                  <div className="flex justify-between border-t border-white/10 pt-4">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-right">{paymentDetails.label}</span>
                  </div>
                )}

                {paymentDetails.memo && (
                  <div className="flex justify-between border-t border-white/10 pt-4">
                    <span className="text-muted-foreground">Memo</span>
                    <span className="text-right text-sm">{paymentDetails.memo}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-white/10 pt-4">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-mono text-sm">{network?.name || "BNB Chain"}</span>
                </div>

                {isConnected && address && (
                  <div className="flex justify-between border-t border-white/10 pt-4">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-mono text-sm">{shortenAddress(address)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-white/10 pt-4">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-mono text-sm">0.5%</span>
                </div>
              </div>
            </div>

            {!isConnected && (
              <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-600">Wallet Not Connected</p>
                  <p className="mt-1 text-xs text-yellow-600/80">Please connect your wallet to send payment</p>
                </div>
              </div>
            )}

            {isPending && status === "pending" && (
              <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Awaiting Confirmation</p>
                  <p className="mt-1 text-xs text-blue-600/80">Please confirm the transaction in your wallet</p>
                </div>
              </div>
            )}

            {isConfirming && (
              <div className="flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Transaction Pending</p>
                  <p className="mt-1 text-xs text-blue-600/80">Your transaction is being confirmed on the blockchain</p>
                  {hash && (
                    <a
                      className="mt-2 inline-block text-xs text-blue-600 underline hover:text-blue-700"
                      href={explorerTxUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View on Explorer →
                    </a>
                  )}
                </div>
              </div>
            )}

            {isSuccess && hash && (
              <div className="space-y-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Payment Successful!</p>
                    <p className="mt-1 text-xs text-green-600/80">Your transaction has been confirmed on the blockchain</p>
                  </div>
                </div>
                <div className="ml-8">
                  <a
                    className="text-xs text-green-600 underline hover:text-green-700"
                    href={explorerTxUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    View Transaction on BscScan →
                  </a>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-600">Transaction Failed</p>
                  <p className="mt-1 text-xs text-red-600/80">
                    {error?.message || "An error occurred while processing your payment"}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 pt-4">
              {!isSuccess ? (
                <>
                  {!isConnected ? (
                    <ConnectButton />
                  ) : (
                    <Button
                      size="lg"
                      className="group h-12 w-full bg-primary text-white hover:bg-primary/90"
                      disabled={isPending || isConfirming || !isConnected}
                      onClick={handleSendPayment}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Confirm in Wallet
                        </>
                      ) : isConfirming ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                          Send {paymentDetails.amount} {paymentDetails.token}
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <Link className="w-full" href="/dashboard">
                  <Button className="w-full" size="lg">
                    Create Another Payment Link
                  </Button>
                </Link>
              )}
            </div>

            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-center text-xs text-blue-600">
              🔒 Contract: {shortenAddress(processorAddress)}
              <p className="mt-1 text-blue-600/70">
                All transactions are processed on BNB blockchain and are irreversible
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function SendPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading payment...</p>
          </div>
        </div>
      }
    >
      <SendPageContent />
    </Suspense>
  )
}
