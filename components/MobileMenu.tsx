"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import AdminSidebar from "./AdminSidebar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  // Montar apenas no cliente para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar móvel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute right-0 top-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={onClose}
          >
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Fechar menu</span>
          </button>
        </div>
        
        <AdminSidebar />
      </div>
    </>
  );
} 