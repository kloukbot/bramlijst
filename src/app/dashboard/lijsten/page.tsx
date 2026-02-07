"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { mockList } from "@/lib/mock-data";

export default function LijstenPage() {
  const list = mockList;

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Mijn lijsten</h1>
          <Link href="/dashboard/lijsten/nieuw">
            <Button className="bg-amber-700 hover:bg-amber-800">
              + Nieuwe lijst
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{list.couple_names}</h2>
                    <Badge variant={list.is_published ? "default" : "secondary"}>
                      {list.is_published ? "Gepubliceerd" : "Privé"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>📅</span>
                    <span>{formatDate(list.wedding_date)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/lijst/${list.slug}`}>
                    <Button variant="outline" size="sm">
                      <span className="mr-2">👁</span>
                      Bekijken
                    </Button>
                  </Link>
                  <Link href={`/lijst/${list.slug}?edit=1`}>
                    <Button variant="outline" size="sm">
                      <span className="mr-2">✏️</span>
                      Bewerken
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    <span className="mr-2">🔗</span>
                    Delen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
