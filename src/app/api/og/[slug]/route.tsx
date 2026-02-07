import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/types"

export const runtime = "edge"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("partner_name_1, partner_name_2, wedding_date, cover_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!profile) {
    return new Response("Not found", { status: 404 })
  }

  const names = [profile.partner_name_1, profile.partner_name_2]
    .filter(Boolean)
    .join(" & ")

  const weddingDate = profile.wedding_date
    ? new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(profile.wedding_date))
    : null

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #fce7f3 0%, #fda4af 50%, #f43f5e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "white",
            borderRadius: 24,
            padding: "48px 64px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: 48, display: "flex" }}>💍</div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              marginTop: 16,
              color: "#1f2937",
              display: "flex",
            }}
          >
            {names || "Cadeaulijst"}
          </div>
          {weddingDate && (
            <div
              style={{
                fontSize: 24,
                color: "#6b7280",
                marginTop: 8,
                display: "flex",
              }}
            >
              {weddingDate}
            </div>
          )}
          <div
            style={{
              fontSize: 20,
              color: "#9ca3af",
              marginTop: 24,
              display: "flex",
            }}
          >
            bramlijst.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
