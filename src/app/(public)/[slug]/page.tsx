import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { Profile, Gift } from "@/types"
import { CoupleHeader } from "@/components/public/couple-header"
import { GiftGrid } from "@/components/public/gift-grid"
import { GiftGridSkeleton } from "@/components/public/gift-grid-skeleton"
import { PaymentResult } from "@/components/public/payment-result"
import { StripeNotConnected } from "@/components/public/stripe-guard"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProfile(slug: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()
  return data as Profile | null
}

async function getGifts(userId: string): Promise<Gift[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("gifts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
  return (data as Gift[]) ?? []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfile(slug)

  if (!profile) {
    return { title: "Niet gevonden" }
  }

  const names = [profile.partner_name_1, profile.partner_name_2]
    .filter(Boolean)
    .join(" & ")

  const title = `Cadeaulijst van ${names}`
  const description =
    profile.welcome_message?.slice(0, 155) ||
    `Bekijk de cadeaulijst van ${names} en draag bij aan hun huwelijkscadeaus.`

  const ogUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://bramlijst.vercel.app"}/api/og/${slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://bramlijst.vercel.app/${slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  }
}

async function GiftGridLoader({
  userId,
  slug,
  stripeReady,
}: {
  userId: string
  slug: string
  stripeReady: boolean
}) {
  const gifts = await getGifts(userId)
  return <GiftGrid gifts={gifts} slug={slug} stripeReady={stripeReady} />
}

export default async function PublicListPage({ params }: PageProps) {
  const { slug } = await params
  const profile = await getProfile(slug)

  if (!profile) {
    notFound()
  }

  const stripeReady = !!profile.stripe_account_id && profile.stripe_onboarding_complete

  return (
    <div className="min-h-screen bg-background">
      <CoupleHeader profile={profile} />

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <Suspense fallback={null}>
          <PaymentResult />
        </Suspense>

        {!stripeReady && <StripeNotConnected />}

        <Suspense fallback={<GiftGridSkeleton />}>
          <GiftGridLoader
            userId={profile.id}
            slug={slug}
            stripeReady={stripeReady}
          />
        </Suspense>
      </main>
    </div>
  )
}
