import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Verificar preferência salva
                const savedTheme = localStorage.getItem('theme');
                // Verificar preferência do sistema
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
                  .matches ? 'dark' : 'light';
                
                // Aplicar tema
                const theme = savedTheme || systemTheme;
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error(e);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors/>
      </body>
    </html>
  );
}
