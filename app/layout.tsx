import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krato - Cardápio Digital",
  description: "Plataforma de cardápio digital e gestão de pedidos online.",
  applicationName: "Krato",
  keywords: ["cardápio digital", "restaurante", "pedidos online", "delivery", "comida"],
  authors: [
    {
      name: "Krato",
      url: "https://krato.com.br",
    },
  ],
  creator: "Krato",
  publisher: "Krato",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors/>
        </AuthProvider>
      </body>
    </html>
  );
}
