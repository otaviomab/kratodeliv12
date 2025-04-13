"use client";

import { Menu, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();

  // Função para obter título da página com base no pathname
  const getPageTitle = () => {
    const path = pathname?.split("/").pop() || "";
    
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      orders: "Pedidos",
      menu: "Cardápio",
      reports: "Relatórios",
      settings: "Configurações",
    };
    
    return titles[path] || "Dashboard";
  };

  return (
    <header className="z-10 border-b bg-background">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center px-6">
          <button
            type="button"
            className="md:hidden -ml-2 mr-2 flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted"
            onClick={onToggleSidebar}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu lateral</span>
          </button>
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        </div>
        
        <div className="flex items-center gap-4 px-6">
          <ThemeToggle />
          
          <button 
            type="button" 
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary"></span>
            <span className="sr-only">Notificações</span>
          </button>
          
          <div className="relative">
            <button 
              type="button" 
              className="flex items-center justify-center rounded-full hover:bg-muted"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-5 w-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 