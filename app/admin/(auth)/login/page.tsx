"use client";

import { useState } from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirecionamento (em produção usaria uma função real de login e redirecionamento)
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
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
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Ou{" "}
            <Link
              href="/admin/cadastrar"
              className="font-medium text-[#fe5f02] hover:text-[#fe5f02]/90 transition-colors"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember_me" />
                  <Label
                    htmlFor="remember_me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Lembrar de mim
                  </Label>
                </div>

                <Link
                  href="/admin/recuperar-senha"
                  className="text-sm font-medium text-[#fe5f02] hover:text-[#fe5f02]/90 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#fe5f02] hover:bg-[#fe5f02]/90 text-white transition-colors"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 