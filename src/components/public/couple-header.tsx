import Image from "next/image"
import type { Profile } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr))
}

export function CoupleHeader({ profile }: { profile: Profile }) {
  const names = [profile.partner_name_1, profile.partner_name_2]
    .filter(Boolean)
    .join(" & ")

  return (
    <div className="relative">
      {/* Cover image */}
      {profile.cover_image_url ? (
        <div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden">
          <Image
            src={profile.cover_image_url}
            alt={`Cover foto van ${names}`}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div className="h-48 sm:h-64 md:h-80 w-full bg-gradient-to-br from-rose-100 to-pink-200" />
      )}

      {/* Profile info overlay */}
      <div className="relative mx-auto max-w-3xl px-4 -mt-16 sm:-mt-20 text-center">
        {profile.avatar_url && (
          <Avatar className="mx-auto h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url} alt={names} />
            <AvatarFallback className="text-2xl">
              {(profile.partner_name_1?.[0] ?? "") +
                (profile.partner_name_2?.[0] ?? "")}
            </AvatarFallback>
          </Avatar>
        )}

        <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {names || "Ons Huwelijk"}
        </h1>

        {profile.wedding_date && (
          <p className="mt-2 text-muted-foreground text-lg">
            {formatDate(profile.wedding_date)}
          </p>
        )}

        {profile.welcome_message && (
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed whitespace-pre-line">
            {profile.welcome_message}
          </p>
        )}
      </div>
    </div>
  )
}
