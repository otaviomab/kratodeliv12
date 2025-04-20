"use client";

import { useState, useRef } from "react";
import { Menu, Bell, Settings, LogOut, User, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import { useAuth } from "@/hooks/useAuth";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  
  useClickOutside(notificationsRef, () => setShowNotifications(false));
  useClickOutside(profileMenuRef, () => setShowProfileMenu(false));
  
  // Exemplo de notificações
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Novo Pedido",
      message: "Pedido #1234 foi recebido",
      time: "Agora mesmo",
      read: false
    },
    {
      id: "2",
      title: "Atualização",
      message: "Nova versão do sistema disponível",
      time: "2 horas atrás",
      read: true
    }
  ];

  const handleLogoutClick = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout (Header):", error);
      toast.error("Falha ao sair. Tente novamente.");
    }
  };

  const handleChangePassword = () => {
    // Implementar lógica de mudança de senha aqui
    toast.info("Funcionalidade em desenvolvimento");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-end px-4">
        <Button
          variant="ghost"
          className="absolute left-4 md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <div className="flex items-center gap-4">
          {/* Menu de Notificações */}
          <div className="relative" ref={notificationsRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold">Notificações</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Nenhuma notificação no momento
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Menu de Perfil */}
          <div className="relative" ref={profileMenuRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">Administrador</span>
                <span className="text-xs text-muted-foreground">admin@krato.com.br</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-medium text-black">A</span>
                </span>
              </Button>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold">Minha Conta</p>
                </div>
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
                    onClick={() => toast.info("Editar perfil - Em desenvolvimento")}
                  >
                    <User className="h-4 w-4" />
                    Editar Perfil
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
                    onClick={handleChangePassword}
                  >
                    <Key className="h-4 w-4" />
                    Alterar Senha
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50"
                    onClick={() => toast.info("Configurações - Em desenvolvimento")}
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-gray-50 text-red-600"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 