"use client";

import { Globe, MapPin, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Informações Gerais",
    icon: Globe,
    href: "/admin/settings/general",
  },
  {
    title: "Endereço",
    icon: MapPin,
    href: "/admin/settings/address",
  },
  {
    title: "Horário de Funcionamento",
    icon: Clock,
    href: "/admin/settings/business-hours",
  },
  {
    title: "Configurações de Entrega",
    icon: MapPin,
    href: "/admin/settings/delivery",
  },
  {
    title: "Métodos de Pagamento",
    icon: DollarSign,
    href: "/admin/settings/payment",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full gap-6 p-6 bg-[#fdfaf5]">
      {/* Menu Lateral */}
      <div className="w-64 bg-white rounded-lg border border-border/10 p-4 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] h-fit">
        <h2 className="text-xl font-bold mb-4">Configurações</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-[#fdfaf5] text-gray-700"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="flex-1">
        <div className="bg-white rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          {children}
        </div>
      </div>
    </div>
  );
} 