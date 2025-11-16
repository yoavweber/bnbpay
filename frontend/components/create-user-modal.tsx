"use client"

import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wallet: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating user:", formData)
    // Here you would typically make an API call to create the user
    alert(`User ${formData.name} created successfully!`)
    onClose()
    setFormData({ name: "", email: "", wallet: "" })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Create New User</h2>
          <p className="mt-1 text-sm text-neutral-400">Add a new user to the platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neutral-300">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-neutral-300">
              Wallet Address
            </Label>
            <Input
              id="wallet"
              type="text"
              placeholder="0x742d...4f2a"
              value={formData.wallet}
              onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
              className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
