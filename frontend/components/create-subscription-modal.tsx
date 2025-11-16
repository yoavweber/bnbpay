"use client"

import { useState } from "react"
import { X, LinkIcon, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  recipientAddress?: string
}

export function CreateSubscriptionModal({ isOpen, onClose, userName, recipientAddress }: CreateSubscriptionModalProps) {
  const [plan, setPlan] = useState("")
  const [price, setPrice] = useState("")
  const [period, setPeriod] = useState<"year" | "unlimited">("year")
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateLink = async () => {
    if (!plan || !price) return

    try {
      setIsLoading(true)
      setError(null)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
      const response = await fetch(`${backendUrl}/api/subscription/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: recipientAddress,
          amountPerPeriod: price,
          intervalDays: period === "year" ? 365 : undefined,
          token: "BNB",
          label: plan,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription link")
      }

      const data = await response.json()
      if (!data?.success || !data?.subscriptionLink) {
        throw new Error(data?.error || "Unexpected response from server")
      }

      setGeneratedLink(data.subscriptionLink)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setPlan("")
    setPrice("")
    setPeriod("year")
    setGeneratedLink("")
    setCopied(false)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="relative w-full max-w-md border-neutral-800 bg-neutral-900 p-6">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-neutral-400 transition-colors hover:text-white"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Create Subscription</h2>
          <p className="text-sm text-neutral-400">for {userName}</p>
        </div>

        <div className="space-y-4">
          {/* Plan Selection */}
          <div>
            <Label htmlFor="plan" className="mb-2 block text-sm font-medium text-white">
              Plan Name
            </Label>
            <Input
              id="plan"
              type="text"
              placeholder="e.g., Premium Plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
            />
          </div>

          {/* Price Input */}
          <div>
            <Label htmlFor="price" className="mb-2 block text-sm font-medium text-white">
              Price (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border-neutral-700 bg-neutral-800 pl-8 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>

          {/* Period Selection */}
          <div>
            <Label className="mb-2 block text-sm font-medium text-white">
              Billing Period
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPeriod("year")}
                className={`rounded-lg border p-3 text-center transition-all ${
                  period === "year"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                    : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                <div className="text-sm font-semibold">Yearly</div>
                <div className="text-xs">Annual billing</div>
              </button>
              <button
                onClick={() => setPeriod("unlimited")}
                className={`rounded-lg border p-3 text-center transition-all ${
                  period === "unlimited"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                    : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                <div className="text-sm font-semibold">Unlimited</div>
                <div className="text-xs">One-time payment</div>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-500">
                <Check className="size-4" />
                <span>Payment Link Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="flex-1 border-neutral-700 bg-neutral-800 text-xs text-white"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleCreateLink}
              disabled={!plan || !price || isLoading}
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50"
            >
              <LinkIcon className="mr-2 size-4" />
              {isLoading ? "Generating..." : "Generate Link"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
