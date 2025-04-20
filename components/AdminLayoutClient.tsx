"use client";

import { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import MobileMenu from "@/components/MobileMenu";

interface AdminLayoutClientProps {
  children: ReactNode;
}

// Componente de Loading simples
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#fdfaf5]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#fe5f02]"></div>
  </div>
);

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Se não está carregando e não há usuário, redireciona para login
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [isLoading, user, router]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Se ainda está carregando a informação de autenticação, mostra o loading
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Se passou pela verificação e não está carregando, mas ainda não tem usuário 
  // (pode acontecer brevemente antes do redirect), não renderiza nada ou loading novamente
  if (!user) {
     return <LoadingSpinner />; // Ou return null;
  }

  // Se está autenticado, renderiza o layout normal
  return (
    <div className="min-h-screen bg-[#fdfaf5]">
      {/* Menu móvel para dispositivos pequenos */}
      <MobileMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sidebar para desktop */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:z-50 md:w-64 border-r bg-white">
        <AdminSidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="md:ml-64 flex flex-col min-h-screen bg-[#fdfaf5]">
        <AdminHeader onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1 p-4 md:p-6 bg-[#fdfaf5]">
          {children}
        </main>
      </div>
    </div>
  );
} 