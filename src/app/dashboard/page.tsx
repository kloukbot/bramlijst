"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockList, mockGifts, getTotalReceived, getTotalTransactions, mockContributions } from "@/lib/mock-data";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { GiftDialog } from "@/components/gift-dialog";
import { Gift } from "@/types";

export default function DashboardPage() {
  const [gifts, setGifts] = useState(mockGifts);
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);

  const totalReceived = getTotalReceived("1");
  const totalTransactions = getTotalTransactions("1");
  const list = mockList;

  const handleAddGift = (gift: Omit<Gift, "id" | "list_id" | "received_amount" | "created_at" | "updated_at">) => {
    const newGift: Gift = {
      ...gift,
      id: String(gifts.length + 1),
      list_id: "1",
      received_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGifts([...gifts, newGift]);
    setShowGiftDialog(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-8">
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welkom bij Bramlijst, {list.couple_names} 👋
            </CardTitle>
            <CardDescription>
              In 2 stappen staat je lijst live en deelbaar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">1) Voeg je eerste cadeau toe</span>
                  {gifts.length > 0 && <span className="text-green-600">✓</span>}
                </div>
                {gifts.length === 0 && (
                  <Button 
                    size="sm" 
                    onClick={() => setShowGiftDialog(true)}
                    className="bg-amber-700 hover:bg-amber-800"
                  >
                    + Cadeau
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">2) Publiceer & deel</span>
                {!list.is_published && (
                  <Button size="sm" variant="outline">
                    Publiceer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Totaal ontvangen</p>
              <p className="text-2xl font-bold">€{totalReceived.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Aantal transacties</p>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Bruiloft</p>
              <p className="text-lg font-semibold">{list.couple_names}</p>
              <p className="text-sm text-muted-foreground">{formatDate(list.wedding_date)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Gifts Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Cadeaulijst</h2>
            <Button 
              onClick={() => setShowGiftDialog(true)}
              className="bg-amber-700 hover:bg-amber-800"
            >
              + Nieuw cadeau
            </Button>
          </div>
          
          {gifts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((gift) => (
                <Card key={gift.id} className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold mb-1">{gift.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{gift.description}</p>
                    <div className="space-y-2">
                      <Progress 
                        value={(gift.received_amount / gift.target_amount) * 100} 
                        className="h-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        €{gift.received_amount.toFixed(2)} van €{gift.target_amount.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Nog geen cadeaus toegevoegd.
                </p>
                <Button 
                  onClick={() => setShowGiftDialog(true)}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  + Voeg je eerste cadeau toe
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>Ontvangen bijdragen</CardTitle>
          </CardHeader>
          <CardContent>
            {mockContributions.length > 0 ? (
              <div className="space-y-4">
                {mockContributions.slice(0, 5).map((contribution) => {
                  const gift = gifts.find(g => g.id === contribution.gift_id);
                  return (
                    <div key={contribution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{contribution.donor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {gift?.title} — "{contribution.message}"
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-green-700">
                        +€{contribution.amount.toFixed(2)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nog geen bijdragen ontvangen. Publiceer je lijst en deel de link!
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <GiftDialog 
        open={showGiftDialog}
        onOpenChange={setShowGiftDialog}
        onSave={handleAddGift}
        gift={editingGift}
      />
    </div>
  );
}
