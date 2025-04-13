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
    <div className="min-h-screen bg-[#fdfaf5] dark:bg-background">
      {/* Menu móvel para dispositivos pequenos */}
      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sidebar para desktop */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:z-50 md:w-64 border-r bg-white dark:bg-background">
        <AdminSidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="md:ml-64 flex flex-col min-h-screen bg-[#fdfaf5] dark:bg-background">
        <AdminHeader onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-4 md:p-6 bg-[#fdfaf5] dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
} 