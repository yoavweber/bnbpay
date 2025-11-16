import Link from "next/link"
import { ArrowRight, Wallet, LinkIcon, Share2, BarChart3, Shield, Zap, Globe, Lock, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <nav className="sticky top-0 z-50 border-b border-neutral-800/50 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Nov%2015%2C%202025%2C%2008_50_12%20PM-hL9QGzQ5vODarVi4eDYp1Yrxfu7dMk.png"
                alt="BNBPay Logo"
                className="size-10 object-contain"
              />
              <span className="text-xl font-bold text-white">BNBPay</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(234,179,8,0.08),transparent_50%)]" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-center">
            {/* Text Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2 text-sm text-yellow-400">
                <Zap className="size-4" />
                <span>Built on BNB Chain</span>
              </div>
              
              <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                Digital Currency Payments
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Without The Hassle
                </span>
              </h1>
              
              <p className="mb-10 text-balance text-lg text-neutral-400 md:text-xl">
                Receive cryptocurrency payments effortlessly. Zero complicated setup, zero hidden charges. Experience swift, protected, and dependable blockchain transactions.
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
                  Start Now
                  <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10">
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Large Cat Logo */}
            <div className="flex-shrink-0">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Nov%2015%2C%202025%2C%2008_50_12%20PM-hL9QGzQ5vODarVi4eDYp1Yrxfu7dMk.png"
                alt="BNBPay Mascot"
                className="size-64 object-contain md:size-96 lg:size-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-neutral-800 bg-black py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
              Getting <span className="text-yellow-500">Started</span>
            </h2>
            <p className="text-lg text-neutral-400">
              Begin receiving crypto payments in just 4 easy steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                icon: Wallet,
                title: "Link Your Wallet",
                description: "Link your Core, MetaMask, or any BNB-supported wallet to begin your journey."
              },
              {
                step: "02",
                icon: LinkIcon,
                title: "Build Payment URL",
                description: "Instantly create payment URLs or subscription options. Set your own amounts and token types."
              },
              {
                step: "03",
                icon: Share2,
                title: "Distribute & Collect",
                description: "Send your payment URL through links, QR codes, or embed buttons. Receive funds immediately."
              },
              {
                step: "04",
                icon: BarChart3,
                title: "Monitor Activity",
                description: "View payments, subscriptions, and earnings from your dashboard with live data updates."
              }
            ].map((item, index) => (
              <Card key={index} className="group relative overflow-hidden border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-yellow-500/50">
                <div className="absolute -right-6 -top-6 text-8xl font-bold text-neutral-800/50">
                  {item.step}
                </div>
                <div className="relative">
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-500">
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-800 bg-gradient-to-br from-yellow-500/10 via-black to-black py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Nov%2015%2C%202025%2C%2008_46_49%20PM-UH1PRLUX64ukoBYUB8RHiLX7Yjse1c.png"
              alt="BNBPay Cat"
              className="mb-8 size-40 object-contain"
            />
            <h2 className="mb-4 max-w-3xl text-balance text-4xl font-bold text-white md:text-5xl">
              Launch Your Crypto Payment Solution Today
            </h2>
            <p className="mb-8 max-w-2xl text-balance text-lg text-neutral-400">
              Become part of a growing community of merchants leveraging BNBPay for effortless digital currency payments.
            </p>
            <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
              Start Free Today
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-neutral-400">
              © 2025 BNBPay. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-neutral-400 hover:text-yellow-500">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-neutral-400 hover:text-yellow-500">
                Terms
              </Link>
              <Link href="#" className="text-sm text-neutral-400 hover:text-yellow-500">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
