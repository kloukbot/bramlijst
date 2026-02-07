import { Skeleton } from "@/components/ui/skeleton"
import { GiftGridSkeleton } from "@/components/public/gift-grid-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover skeleton */}
      <Skeleton className="h-48 sm:h-64 md:h-80 w-full rounded-none" />

      {/* Profile info skeleton */}
      <div className="mx-auto max-w-3xl px-4 -mt-16 sm:-mt-20 text-center space-y-4">
        <Skeleton className="mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full" />
        <Skeleton className="mx-auto h-9 w-64" />
        <Skeleton className="mx-auto h-5 w-40" />
        <Skeleton className="mx-auto h-16 w-80" />
      </div>

      {/* Gift grid skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <GiftGridSkeleton />
      </div>
    </div>
  )
}
