"use client";

import { useState, ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import MobileMenu from "@/components/MobileMenu";

interface AdminLayoutClientProps {
  children: ReactNode;
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Menu móvel para dispositivos pequenos */}
      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r">
        <AdminSidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        <AdminHeader onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 