"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Plus, Calendar, DollarSign, CreditCard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CreateSubscriptionModal } from "@/components/create-subscription-modal"

type Subscription = {
  id: number
  name: string
  amount: string
  status: "active" | "cancelled"
  nextBilling: string
  startDate: string
}

type UserRecord = {
  name: string
  email: string
  wallet: string
  subscriptions: Subscription[]
}

const buildPaymentLink = (recipient: string, amount: string, label: string) => {
  const sanitizedAmount = amount.replace(/[^0-9.]/g, "") || "0"
  const params = new URLSearchParams({
    to: recipient,
    amount: sanitizedAmount,
    token: "BNB",
    label,
  })

  return `send?${params.toString()}`
}

// Mock data for user subscriptions
const mockUserData: Record<string, UserRecord> = {
  "1": {
    name: "Alice Johnson",
    email: "alice@example.com",
    wallet: "0xd25b8d0d4262ea3d22da769ba1648e40df6c347c",
    subscriptions: [
      {
        id: 1,
        name: "Premium Plan",
        amount: "$150/month",
        status: "active",
        nextBilling: "Dec 1, 2025",
        startDate: "Nov 1, 2025",
      },
      {
        id: 2,
        name: "Pro Features",
        amount: "$200/month",
        status: "active",
        nextBilling: "Dec 15, 2025",
        startDate: "Oct 15, 2025",
      },
      {
        id: 3,
        name: "API Access",
        amount: "$100/month",
        status: "active",
        nextBilling: "Dec 20, 2025",
        startDate: "Nov 20, 2025",
      },
    ],
  },
  "2": {
    name: "Bob Smith",
    email: "bob@example.com",
    wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    subscriptions: [
      {
        id: 4,
        name: "Basic Plan",
        amount: "$150/month",
        status: "active",
        nextBilling: "Dec 5, 2025",
        startDate: "Nov 5, 2025",
      },
    ],
  },
  "3": {
    name: "Carol White",
    email: "carol@example.com",
    wallet: "0x1F5E9a2B8C1F5E9A2b8C1f5e9A2B8C1F5e9a2B8c",
    subscriptions: [
      {
        id: 5,
        name: "Enterprise Plan",
        amount: "$500/month",
        status: "active",
        nextBilling: "Dec 10, 2025",
        startDate: "Oct 10, 2025",
      },
      {
        id: 6,
        name: "Add-on Services",
        amount: "$90/month",
        status: "active",
        nextBilling: "Dec 10, 2025",
        startDate: "Oct 10, 2025",
      },
      {
        id: 7,
        name: "Premium Support",
        amount: "$150/month",
        status: "active",
        nextBilling: "Dec 10, 2025",
        startDate: "Oct 10, 2025",
      },
      {
        id: 8,
        name: "Advanced Analytics",
        amount: "$100/month",
        status: "active",
        nextBilling: "Dec 10, 2025",
        startDate: "Oct 10, 2025",
      },
      {
        id: 9,
        name: "Custom Branding",
        amount: "$50/month",
        status: "active",
        nextBilling: "Dec 10, 2025",
        startDate: "Oct 10, 2025",
      },
    ],
  },
  "4": {
    name: "David Lee",
    email: "david@example.com",
    wallet: "0x9D2A7e3F9d2A7E3F9d2a7e3f9D2A7e3F9D2a7E3F",
    subscriptions: [
      {
        id: 10,
        name: "Starter Plan",
        amount: "$120/month",
        status: "cancelled",
        nextBilling: "N/A",
        startDate: "Sep 1, 2025",
      },
      {
        id: 11,
        name: "API Access",
        amount: "$200/month",
        status: "active",
        nextBilling: "Dec 12, 2025",
        startDate: "Nov 12, 2025",
      },
    ],
  },
}

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()
  const userId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params?.id[0] : undefined
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const userData = userId ? mockUserData[userId as keyof typeof mockUserData] : undefined

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">User not found</h1>
          <Link href="/dashboard">
            <Button className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalRevenue = userData.subscriptions.reduce((acc, sub) => {
    const amount = parseInt(sub.amount.replace(/[^0-9]/g, ''))
    return acc + amount
  }, 0)

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="border-b border-neutral-800/50 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Nov%2015%2C%202025%2C%2008_50_12%20PM-hL9QGzQ5vODarVi4eDYp1Yrxfu7dMk.png"
                alt="BNBPay Logo"
                className="size-10 object-contain"
              />
              <span className="text-xl font-bold text-white">BNBPay Dashboard</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white">
                <ArrowLeft className="mr-2 size-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* User Detail Content */}
      <div className="container mx-auto px-4 py-8">
        {/* User Info Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-yellow-500/10 text-2xl font-bold text-yellow-500">
              {userData.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{userData.name}</h1>
              <p className="text-neutral-400">{userData.email}</p>
              <code className="mt-1 inline-block rounded bg-neutral-800 px-2 py-1 text-sm text-yellow-400">
                {userData.wallet}
              </code>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                <CreditCard className="size-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">
                  {userData.subscriptions.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                <DollarSign className="size-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">${totalRevenue}</p>
              </div>
            </div>
          </Card>
          
          <Card className="border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Calendar className="size-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Subscriptions</p>
                <p className="text-2xl font-bold text-white">{userData.subscriptions.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Subscriptions</h2>
          <Button 
            onClick={() => setIsSubscriptionModalOpen(true)}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <Plus className="mr-2 size-4" />
            Create Subscription
          </Button>
        </div>

        {/* Subscriptions List */}
        <div className="grid gap-4 md:grid-cols-2">
          {userData.subscriptions.map((subscription) => {
            const paymentLink = buildPaymentLink(userData.wallet, subscription.amount, subscription.name)

            return (
              <Card key={subscription.id} className="border-neutral-800 bg-neutral-900/50 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{subscription.name}</h3>
                    <p className="text-2xl font-bold text-yellow-500">{subscription.amount}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    subscription.status === 'active' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Start Date:</span>
                    <span className="text-white">{subscription.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Next Billing:</span>
                    <span className="text-white">{subscription.nextBilling}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">Payment Link</p>
                  <code className="mt-1 inline-block w-full overflow-x-auto rounded border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-yellow-400">
                    {paymentLink}
                  </code>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    Cancel
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Subscription Modal */}
      <CreateSubscriptionModal 
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        userName={userData?.name || "User"}
        recipientAddress={userData?.wallet}
      />
    </div>
  )
}
