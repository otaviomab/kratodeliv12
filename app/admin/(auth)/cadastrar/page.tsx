"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, "");
    
    // Aplica a máscara conforme vai digitando
    let formatted = numbers;
    if (numbers.length > 0) {
      // Adiciona parênteses
      formatted = `(${numbers.slice(0, 2)}`;
      if (numbers.length > 2) {
        // Adiciona o fechamento do parênteses e espaço
        formatted += `) ${numbers.slice(2, 7)}`;
        if (numbers.length > 7) {
          // Adiciona o hífen
          formatted += `-${numbers.slice(7, 11)}`;
        }
      }
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, "");
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (numbers.length <= 11) {
      setPhone(formatPhone(numbers));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast.error("Você precisa aceitar os termos de serviço");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    try {
      await register(email, password, name, phone);
      toast.success("Conta criada com sucesso!");
      router.push("/admin/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao criar conta";
      toast.error(message);
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Comece a gerenciar seu estabelecimento hoje mesmo
          </p>
        </div>

        <Card className="border-none shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do estabelecimento</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="organization"
                    required
                    className="w-full"
                    placeholder="Restaurante Exemplo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    className="w-full"
                    placeholder="(11) 98765-4321"
                    maxLength={15} // (XX) XXXXX-XXXX
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite DDD + número com 9 dígitos
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">Confirmar senha</Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  required 
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Concordo com os{" "}
                  <Link
                    href="#"
                    className="text-[#fe5f02] hover:text-[#fe5f02]/90 transition-colors"
                  >
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="#"
                    className="text-[#fe5f02] hover:text-[#fe5f02]/90 transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#fe5f02] hover:bg-[#fe5f02]/90 text-white transition-colors"
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  href="/admin/login"
                  className="font-medium text-[#fe5f02] hover:text-[#fe5f02]/90 transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 