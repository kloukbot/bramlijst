import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ExternalLink, Gift, Settings } from "lucide-react"
import { ShareButton } from "@/components/share-button"
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  // Get gifts stats
  const { data: gifts } = await supabase
    .from("gifts")
    .select("target_amount, collected_amount")
    .eq("user_id", user.id)

  const totalGifts = gifts?.length ?? 0
  const totalCollected = gifts?.reduce((sum, g) => sum + (g.collected_amount ?? 0), 0) ?? 0

  // contributions count (will be 0 until Epic 6)
  const { count } = await supabase
    .from("contributions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "succeeded")
  const totalContributions = count ?? 0

  const displayName = profile.partner_name_1 && profile.partner_name_2
    ? `${profile.partner_name_1} & ${profile.partner_name_2}`
    : profile.display_name || "daar"

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Welkom, {displayName}! 💍
        </h1>
        <p className="text-sm text-muted-foreground">
          Hier is het overzicht van jullie cadeaulijst.
        </p>
      </div>

      <OnboardingChecklist
        hasProfile={!!(profile.partner_name_1 && profile.partner_name_2)}
        hasStripe={!!profile.stripe_account_id}
        hasGifts={totalGifts > 0}
        hasWelcomeMessage={!!profile.welcome_message}
        isPublished={profile.is_published}
      />

      <StatsCards
        totalCollected={totalCollected}
        totalGifts={totalGifts}
        totalContributions={totalContributions}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Publicatie status</CardTitle>
            <Badge variant={profile.is_published ? "default" : "secondary"}>
              {profile.is_published ? "Gepubliceerd" : "Niet gepubliceerd"}
            </Badge>
          </CardHeader>
          <CardContent className="flex gap-2">
            {profile.is_published && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                    Bekijk lijst <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <ShareButton url={`/${profile.slug}`} />
              </>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-1 h-3 w-3" /> Instellingen
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Snelle acties</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button size="sm" asChild>
              <Link href="/dashboard/gifts/new">
                <Gift className="mr-1 h-3 w-3" /> Cadeau toevoegen
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/gifts">Alle cadeaus</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
