"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, UserPlus, Search, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CreateUserModal } from "@/components/create-user-modal"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

// Mock data for users with subscriptions
const mockUsers = [
  {
    id: 1,
    name: "Real user",
    email: "alice@example.com",
    wallet: "0xd25b8d0d4262ea3d22da769ba1648e40df6c347c",
    subscriptions: 3,
    totalRevenue: "$450",
    status: "active"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    wallet: "0x8a3b...9c1d",
    subscriptions: 1,
    totalRevenue: "$150",
    status: "active"
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    wallet: "0x1f5e...2b8c",
    subscriptions: 5,
    totalRevenue: "$890",
    status: "active"
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@example.com",
    wallet: "0x9d2a...7e3f",
    subscriptions: 2,
    totalRevenue: "$320",
    status: "inactive"
  },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <div className="flex gap-3">
              <Link href="/">
                <Button variant="outline" className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white">
                  <ArrowLeft className="mr-2 size-4" />
                  Back to Home
                </Button>
              </Link>
              <ConnectWalletButton
                size="sm"
                className="bg-yellow-500 text-black hover:bg-yellow-400"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">User Management</h1>
          <p className="text-neutral-400">Manage all users with active subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-yellow-500/10">
                <Users className="size-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{mockUsers.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                <Users className="size-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-400">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">
                  {mockUsers.reduce((acc, user) => acc + user.subscriptions, 0)}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                <span className="text-2xl text-blue-500">$</span>
              </div>
              <div>
                <p className="text-sm text-neutral-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${mockUsers.reduce((acc, user) => acc + parseInt(user.totalRevenue.replace('$', '')), 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-neutral-700 bg-neutral-900 pl-10 text-white placeholder:text-neutral-500"
            />
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <UserPlus className="mr-2 size-4" />
            Create User
          </Button>
        </div>

        {/* Users Table */}
        <Card className="border-neutral-800 bg-neutral-900/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400">Wallet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400">Subscriptions</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-neutral-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-neutral-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-neutral-800 px-2 py-1 text-sm text-yellow-400">
                        {user.wallet}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{user.subscriptions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-500">{user.totalRevenue}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.status === 'active' 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-neutral-700 text-neutral-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/user/${user.id}`}>
                        <Button variant="outline" size="sm" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
