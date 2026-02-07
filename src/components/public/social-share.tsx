"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Share2, MessageCircle } from "lucide-react"

interface SocialShareProps {
  slug: string
  coupleNames: string
}

export function SocialShare({ slug, coupleNames }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(!!navigator.share)
  }, [])

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${slug}`
      : `https://bramlijst.vercel.app/${slug}`

  const whatsappText = encodeURIComponent(
    `Bekijk de cadeaulijst van ${coupleNames}! 💍🎁\n${fullUrl}`
  )

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = fullUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleNativeShare() {
    if (!navigator.share) return
    try {
      await navigator.share({
        title: `Cadeaulijst van ${coupleNames}`,
        url: fullUrl,
      })
    } catch {
      // cancelled
    }
  }

  return (
    <section className="text-center space-y-3 py-8">
      <h3 className="text-sm font-medium text-muted-foreground">
        Deel deze lijst
      </h3>
      <div className="flex justify-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://wa.me/?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
          </a>
        </Button>

        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="mr-1 h-4 w-4" /> Gekopieerd!
            </>
          ) : (
            <>
              <Copy className="mr-1 h-4 w-4" /> Kopieer link
            </>
          )}
        </Button>

        {canShare && (
          <Button variant="outline" size="sm" onClick={handleNativeShare}>
            <Share2 className="mr-1 h-4 w-4" /> Delen
          </Button>
        )}
      </div>
    </section>
  )
}
