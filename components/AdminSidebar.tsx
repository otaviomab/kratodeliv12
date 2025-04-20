"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout (Sidebar):", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95 border-r border-border/10">
      <div className="h-16 px-8 flex items-center border-b border-border/10 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <Store className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-black">
            Krato Admin
          </span>
        </div>
      </div>
      
      <nav className="flex-1 py-8 px-6 space-y-1.5">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "text-primary" : "text-foreground/60 group-hover:text-foreground",
                "group-hover:scale-110"
              )} />
              <span className="transition-colors duration-200">
                {item.title}
              </span>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-6 py-6 mt-auto border-t border-border/10 bg-background/50 backdrop-blur-sm">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:text-red-500" />
          <span className="group-hover:text-red-500 transition-colors duration-200">
            Sair
          </span>
        </button>
      </div>
    </div>
  );
} 