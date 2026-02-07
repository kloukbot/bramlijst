"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { mockList, mockGifts } from "@/lib/mock-data";
import { ContributionDialog } from "@/components/contribution-dialog";
import { Gift } from "@/types";

export default function PublicListPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showContributionDialog, setShowContributionDialog] = useState(false);
  
  // In production, fetch list by slug from Supabase
  const list = mockList;
  const gifts = mockGifts;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleContribute = (giftId: string) => {
    const gift = gifts.find(g => g.id === giftId);
    if (gift) {
      setSelectedGift(gift);
      setShowContributionDialog(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="text-2xl font-serif text-amber-900">
          Bramlijst
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/2">
            <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-amber-300 rounded-2xl flex items-center justify-center">
              <span className="text-6xl">💍</span>
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl font-serif text-amber-900 mb-4">
              {list.couple_names}
            </h1>
            <div className="flex items-center gap-2 text-amber-700 mb-4">
              <span>📅</span>
              <span>{formatDate(list.wedding_date)}</span>
            </div>
            <p className="text-amber-800">
              {list.description}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Gifts */}
        <div className="text-center mb-8">
          <span className="text-2xl">💝</span>
          <h2 className="text-2xl font-serif text-amber-900 mt-2">Cadeaulijst</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {gifts.map((gift) => (
            <Card key={gift.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-5xl">🎁</span>
              </div>
              <CardContent className="pt-4">
                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                  {gift.title}
                </h3>
                <p className="text-sm text-amber-700 mb-4">
                  {gift.description}
                </p>
                <div className="space-y-3">
                  <Progress 
                    value={(gift.received_amount / gift.target_amount) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-700">
                      €{gift.received_amount.toFixed(2)} van €{gift.target_amount.toFixed(2)}
                    </span>
                  </div>
                  <Button 
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    onClick={() => handleContribute(gift.id)}
                  >
                    Kies cadeau
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t border-amber-100">
          <h3 className="font-serif text-xl text-amber-900">{list.couple_names}</h3>
          <p className="text-amber-700">{formatDate(list.wedding_date)}</p>
          <Button variant="outline" className="mt-4 border-amber-700 text-amber-700">
            <span className="mr-2">🔗</span>
            Deel deze lijst
          </Button>
        </div>
      </main>

      <ContributionDialog
        open={showContributionDialog}
        onOpenChange={setShowContributionDialog}
        gift={selectedGift}
      />
    </div>
  );
}
