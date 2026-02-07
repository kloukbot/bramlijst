"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gift } from "@/types";

interface GiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (gift: Omit<Gift, "id" | "list_id" | "received_amount" | "created_at" | "updated_at">) => void;
  gift?: Gift | null;
}

export function GiftDialog({ open, onOpenChange, onSave, gift }: GiftDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (gift) {
      setTitle(gift.title);
      setDescription(gift.description || "");
      setTargetAmount(String(gift.target_amount));
      setImage(gift.image || "");
    } else {
      setTitle("");
      setDescription("");
      setTargetAmount("");
      setImage("");
    }
  }, [gift, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      target_amount: parseFloat(targetAmount),
      image,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{gift ? "Cadeau bewerken" : "Cadeau toevoegen"}</DialogTitle>
          <DialogDescription>
            Voeg een cadeau toe aan jullie lijst.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                placeholder="bijv. Koffiezetapparaat"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Bedrag in euro</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                placeholder="150"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschrijving (optioneel)</Label>
              <Textarea
                id="description"
                placeholder="Vertel waarom jullie dit cadeau willen..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Afbeelding (optioneel)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" className="bg-amber-700 hover:bg-amber-800">
              Opslaan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
