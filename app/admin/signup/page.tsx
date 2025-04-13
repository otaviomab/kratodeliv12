"use client";

import { useState } from "react";
import Link from "next/link";
import { Store } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de cadastro
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Redirecionamento (em produção usaria uma função real de cadastro e redirecionamento)
      window.location.href = "/admin/dashboard";
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Store className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Comece a gerenciar seu estabelecimento hoje mesmo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10 border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Nome do estabelecimento
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="organization"
                  required
                  className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-foreground"
              >
                Confirmar senha
              </label>
              <div className="mt-1">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-input bg-background px-3 py-2 text-foreground shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-foreground"
              >
                Concordo com os{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/90"
                >
                  Termos de Serviço
                </a>{" "}
                e{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/90"
                >
                  Política de Privacidade
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href="/admin/login"
              className="font-medium text-primary hover:text-primary/90"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 