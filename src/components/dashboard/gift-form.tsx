"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createGift, updateGift, uploadGiftImage } from "@/actions/gifts"
import { euroToCents, centsToEuro, cn } from "@/lib/utils"
import type { Gift as GiftType } from "@/types"

type GiftFormProps = {
  gift?: GiftType
  mode: "create" | "edit"
}

export function GiftForm({ gift, mode }: GiftFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(gift?.name ?? "")
  const [description, setDescription] = useState(gift?.description ?? "")
  const [targetAmountEuro, setTargetAmountEuro] = useState(
    gift ? centsToEuro(gift.target_amount).toString() : ""
  )
  const [allowPartial, setAllowPartial] = useState(gift?.allow_partial ?? true)
  const [minContributionEuro, setMinContributionEuro] = useState(
    gift ? centsToEuro(gift.min_contribution).toString() : "5"
  )
  const [isVisible, setIsVisible] = useState(gift?.is_visible ?? true)
  const [imagePreview, setImagePreview] = useState<string | null>(gift?.image_url ?? null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const targetAmountCents = euroToCents(parseFloat(targetAmountEuro))
      const minContributionCents = euroToCents(parseFloat(minContributionEuro || "5"))

      if (isNaN(targetAmountCents) || targetAmountCents < 100) {
        setError("Voer een geldig doelbedrag in (minimaal €1,00)")
        setLoading(false)
        return
      }

      const data = {
        name,
        description: description || undefined,
        targetAmount: targetAmountCents,
        allowPartial,
        minContribution: minContributionCents,
        isVisible,
      }

      let imageUrl: string | undefined
      if (selectedFile) {
        const formData = new FormData()
        formData.set("file", selectedFile)
        const uploadResult = await uploadGiftImage(formData)
        if (uploadResult.error) {
          setError(uploadResult.error)
          setLoading(false)
          return
        }
        imageUrl = uploadResult.url
      }

      let result
      if (mode === "create") {
        result = await createGift(data, imageUrl)
      } else if (gift) {
        result = await updateGift(gift.id, data, imageUrl)
      }

      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/dashboard/gifts")
      }
    } catch {
      setError("Er ging iets mis")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cadeau details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Naam *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. Keukenrobot"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optionele beschrijving..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Doelbedrag (€) *</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="1"
                value={targetAmountEuro}
                onChange={(e) => setTargetAmountEuro(e.target.value)}
                placeholder="250.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minContribution">Minimum bijdrage (€)</Label>
              <Input
                id="minContribution"
                type="number"
                step="0.01"
                min="1"
                value={minContributionEuro}
                onChange={(e) => setMinContributionEuro(e.target.value)}
                placeholder="5.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Afbeelding</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary/80 transition-colors"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill sizes="200px" className="object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Klik om een afbeelding te uploaden</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Opties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Deelbedragen toestaan</Label>
              <p className="text-sm text-muted-foreground">
                Gasten kunnen een deel van het bedrag bijdragen
              </p>
            </div>
            <Switch checked={allowPartial} onCheckedChange={setAllowPartial} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Zichtbaar op lijst</Label>
              <p className="text-sm text-muted-foreground">
                Cadeau is zichtbaar voor gasten
              </p>
            </div>
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Opslaan..." : mode === "create" ? "Cadeau toevoegen" : "Opslaan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annuleren
        </Button>
      </div>
    </form>
  )
}
