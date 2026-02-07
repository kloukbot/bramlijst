"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/dashboard/image-upload"
import { updateProfile, uploadCoverImage, uploadAvatar, togglePublished } from "@/actions/settings"
import type { Profile } from "@/types"
import { themes, themeKeys, type ThemeKey } from "@/lib/themes"
import { ExternalLink } from "lucide-react"

type ProfileFormProps = {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [partnerName1, setPartnerName1] = useState(profile.partner_name_1 ?? "")
  const [partnerName2, setPartnerName2] = useState(profile.partner_name_2 ?? "")
  const [slug, setSlug] = useState(profile.slug)
  const [weddingDate, setWeddingDate] = useState(profile.wedding_date ?? "")
  const [welcomeMessage, setWelcomeMessage] = useState(profile.welcome_message ?? "")
  const [theme, setTheme] = useState<ThemeKey>((profile.theme as ThemeKey) ?? "romantic")
  const [isPublished, setIsPublished] = useState(profile.is_published)
  const [loading, setLoading] = useState(false)
  const [publishLoading, setPublishLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const result = await updateProfile({
        partnerName1,
        partnerName2,
        slug,
        weddingDate: weddingDate || undefined,
        welcomeMessage: welcomeMessage || undefined,
        theme,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError("Er ging iets mis")
    } finally {
      setLoading(false)
    }
  }

  async function handleTogglePublished() {
    setPublishLoading(true)
    try {
      const result = await togglePublished()
      if (result.error) {
        setError(result.error)
      } else {
        setIsPublished(!isPublished)
      }
    } catch {
      setError("Er ging iets mis")
    } finally {
      setPublishLoading(false)
    }
  }

  const publicUrl = `/${slug}`

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Profiel bijgewerkt!
        </div>
      )}

      {/* Publish toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lijst publiceren</CardTitle>
          <CardDescription>
            Maak jullie cadeaulijst zichtbaar voor gasten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Gepubliceerd" : "Niet gepubliceerd"}
              </Badge>
              {isPublished && (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Bekijk lijst <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={handleTogglePublished}
              disabled={publishLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Afbeeldingen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload
            currentUrl={profile.cover_image_url}
            onUpload={uploadCoverImage}
            label="Cover foto"
            aspectRatio="cover"
          />
          <ImageUpload
            currentUrl={profile.avatar_url}
            onUpload={uploadAvatar}
            label="Profielfoto"
            aspectRatio="square"
          />
        </CardContent>
      </Card>

      {/* Profile details */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profiel gegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="partnerName1">Naam partner 1 *</Label>
                <Input
                  id="partnerName1"
                  value={partnerName1}
                  onChange={(e) => setPartnerName1(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerName2">Naam partner 2 *</Label>
                <Input
                  id="partnerName2"
                  value={partnerName2}
                  onChange={(e) => setPartnerName2(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">bramlijst.nl/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Let op: als je de URL wijzigt, werken oude links niet meer.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weddingDate">Trouwdatum</Label>
              <Input
                id="weddingDate"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welkomstbericht</Label>
              <Textarea
                id="welcomeMessage"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Lief welkomstbericht voor jullie gasten..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Thema voor je publieke pagina</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {themeKeys.map((key) => {
                  const t = themes[key]
                  const selected = theme === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key)}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors ${
                        selected ? "border-primary bg-muted" : "border-border hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex gap-1">
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{ backgroundColor: t.swatchColors[0] }}
                        />
                        <div
                          className="h-6 w-6 rounded-full border"
                          style={{ backgroundColor: t.swatchColors[1] }}
                        />
                      </div>
                      <span className="text-xs font-medium">{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Opslaan..." : "Opslaan"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
