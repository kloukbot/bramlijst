"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Gift } from "@/types";

interface ContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gift: Gift | null;
}

export function ContributionDialog({ open, onOpenChange, gift }: ContributionDialogProps) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!gift) return null;

  const remaining = gift.target_amount - gift.received_amount;
  const progress = (gift.received_amount / gift.target_amount) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In production, this would:
    // 1. Create a Stripe Checkout Session
    // 2. Redirect to Stripe
    // 3. Handle webhook for successful payment
    // 4. Update contribution in database

    // Mock: show success after delay
    setTimeout(() => {
      alert(`Bedankt voor je bijdrage van €${amount}! In productie zou je nu naar Stripe worden doorgestuurd.`);
      setLoading(false);
      setAmount("");
      setMessage("");
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        {/* Gift Image */}
        <div className="h-48 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center rounded-t-lg">
          <span className="text-6xl">🎁</span>
        </div>

        <div className="space-y-4">
          {/* Gift Info */}
          <div>
            <h2 className="text-xl font-semibold text-amber-900">{gift.title}</h2>
            <p className="text-sm text-amber-700">{gift.description}</p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-amber-700">
                €{gift.received_amount.toFixed(2)} van €{gift.target_amount.toFixed(2)}
              </span>
              <span className="text-amber-600">
                €{remaining.toFixed(2)} resterend
              </span>
            </div>
          </div>

          {/* Contribution Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Kies je eigen bedrag</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  €
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  max={remaining}
                  step="0.01"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Persoonlijk bericht (optioneel)</Label>
              <Textarea
                id="message"
                placeholder="Laat een persoonlijk bericht achter voor het bruidspaar..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuleren
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800"
                disabled={!amount || parseFloat(amount) <= 0 || loading}
              >
                {loading ? "Laden..." : "Bevestig bijdrage"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
