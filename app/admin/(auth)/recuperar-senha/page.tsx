"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RecuperarSenhaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de envio de email
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fe5f02]/10 to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-[#fe5f02]/10 p-4">
            <Store className="h-10 w-10 text-[#fe5f02]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#fe5f02] to-[#fe5f02]/70">
            Recuperar senha
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Digite seu email para receber as instruções
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full"
                    placeholder="seu@email.com"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#fe5f02] hover:bg-[#fe5f02]/90 text-white transition-colors"
                >
                  {isLoading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    Email enviado!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Não recebeu? Verifique sua caixa de spam.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center text-sm text-[#fe5f02] hover:text-[#fe5f02]/90 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 