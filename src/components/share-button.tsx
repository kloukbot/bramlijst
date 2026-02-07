"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Share2 } from "lucide-react"

interface ShareButtonProps {
  url: string
  title?: string
  variant?: "outline" | "default" | "ghost"
  size?: "sm" | "default" | "lg" | "icon"
  label?: string
}

export function ShareButton({
  url,
  title = "Bekijk onze cadeaulijst",
  variant = "outline",
  size = "sm",
  label = "Kopieer link",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const fullUrl = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`

    // Try native share on mobile
    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl })
        return
      } catch {
        // User cancelled or not supported, fall through to copy
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = fullUrl
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleShare}>
      {copied ? (
        <>
          <Check className="mr-1 h-3 w-3" /> Gekopieerd!
        </>
      ) : (
        <>
          <Copy className="mr-1 h-3 w-3" /> {label}
        </>
      )}
    </Button>
  )
}
