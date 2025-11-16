"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const tx = searchParams.get("tx")
  const to = searchParams.get("to")
  const amount = searchParams.get("amount")
  const token = searchParams.get("token") || "BNB"

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 pt-24 text-center">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="glass space-y-6 border border-white/10 p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Payment Successful</h1>
            <p className="mt-2 text-muted-foreground">
              Your transaction has been confirmed on the blockchain.
            </p>
          </div>

          <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-6 text-left text-sm">
            {amount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-white">
                  {amount} {token}
                </span>
              </div>
            )}
            {to && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-mono text-xs text-white">{to}</span>
              </div>
            )}
            {tx && (
              <div className="flex flex-col gap-2">
                <span className="text-muted-foreground">Transaction Hash</span>
                <a
                  href={`https://bscscan.com/tx/${tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-xs text-yellow-400 hover:text-yellow-300"
                >
                  {tx}
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full">Create Another Link</Button>
            </Link>
            <Link href="/send" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">
                Send Another Payment
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-muted-foreground">Loading confirmation...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
