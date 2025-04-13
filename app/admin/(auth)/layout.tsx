import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Krato",
    default: "Krato - Cardápio Digital",
  },
  description: "Sistema de cardápio digital para seu estabelecimento",
};

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 