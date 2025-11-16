import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address?: string, chars = 4) {
  if (!address || address.length < chars * 2) {
    return address ?? ""
  }

  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}
