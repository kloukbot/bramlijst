import { GiftForm } from "@/components/dashboard/gift-form"

export default function NewGiftPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl font-semibold text-foreground md:text-3xl">
          Nieuw cadeau
        </h1>
        <p className="text-sm text-muted-foreground">
          Voeg een cadeau toe aan jullie lijst
        </p>
      </div>

      <GiftForm mode="create" />
    </div>
  )
}
