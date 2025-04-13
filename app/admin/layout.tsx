import { Metadata } from "next";
import { ReactNode } from "react";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export const metadata: Metadata = {
  title: {
    template: "%s | Krato Admin",
    default: "Painel Administrativo | Krato",
  },
  description: "Painel de controle para gerenciar seu estabelecimento",
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Não renderiza o AdminLayoutClient para as rotas de autenticação
  return children;
} 