export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <img 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Nov%2015%2C%202025%2C%2008_50_12%20PM-hL9QGzQ5vODarVi4eDYp1Yrxfu7dMk.png"
        alt="BNBPay Mascot"
        className="size-48 object-contain"
      />
      <span className="text-4xl font-bold">
        <span className="text-white">BNB</span>
        <span className="text-yellow-500">Pay</span>
      </span>
    </div>
  )
}
