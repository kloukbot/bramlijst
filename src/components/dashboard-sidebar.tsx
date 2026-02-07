"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    title: "Mijn lijsten",
    href: "/dashboard/lijsten",
    icon: "📋",
  },
  {
    title: "Instellingen",
    href: "/dashboard/instellingen",
    icon: "⚙️",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-serif text-amber-900">
          Bramlijst
        </Link>
      </div>

      <nav className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          Platform
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-amber-100 text-amber-900"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <span>{item.icon}</span>
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-amber-200 text-amber-800">
              BF
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Bram en Frank</p>
            <p className="text-xs text-muted-foreground truncate">
              demo@felicio.nl
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
