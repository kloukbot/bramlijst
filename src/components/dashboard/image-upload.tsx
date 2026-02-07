"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ImageUploadProps = {
  currentUrl?: string | null
  onUpload: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  label?: string
  className?: string
  aspectRatio?: "square" | "cover"
}

export function ImageUpload({
  currentUrl,
  onUpload,
  label = "Afbeelding uploaden",
  className,
  aspectRatio = "square",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayUrl = preview || currentUrl

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setPreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.set("file", file)

    setUploading(true)
    try {
      const result = await onUpload(formData)
      if (result.error) {
        setError(result.error)
        setPreview(null)
      }
    } catch {
      setError("Upload mislukt")
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium">{label}</p>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary/80 transition-colors",
          aspectRatio === "cover" ? "aspect-[3/1]" : "aspect-square w-32"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={label}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
