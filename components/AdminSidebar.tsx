"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  BarChart3,
  LogOut,
  Store,
  CreditCard,
  Users,
} from "lucide-react";

// Lista de itens do menu lateral
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "Cardápio",
    href: "/admin/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Clientes",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Relatórios",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Planos",
    href: "/admin/planos",
    icon: CreditCard,
  },
  {
    title: "Configurações",
    href: "/admin/settings/general",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="h-16 px-6 flex items-center border-b">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Krato Admin</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-6 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-6 py-4 mt-auto border-t">
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors">
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
} 