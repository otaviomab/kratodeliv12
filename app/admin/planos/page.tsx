"use client";

import { useState } from "react";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Types para as informações dos planos
interface Plano {
  id: string;
  nome: string;
  preco: {
    mensal: number;
    anual: number;
  };
  descricao: string;
  destaque?: boolean;
  recursos: string[];
}

const planos: Plano[] = [
  {
    id: "basico",
    nome: "Básico",
    preco: {
      mensal: 49.90,
      anual: 479.90
    },
    descricao: "Ideal para pequenos estabelecimentos que estão começando.",
    recursos: [
      "Cardápio digital personalizado",
      "Gerenciamento de pedidos",
      "Até 50 produtos cadastrados",
      "Relatórios básicos",
      "Suporte por e-mail"
    ]
  },
  {
    id: "profissional",
    nome: "Profissional",
    preco: {
      mensal: 89.90,
      anual: 863.90
    },
    descricao: "Perfeito para restaurantes em crescimento que precisam de mais recursos.",
    destaque: true,
    recursos: [
      "Todos os recursos do plano Básico",
      "Até 150 produtos cadastrados",
      "Gestão de múltiplos estabelecimentos",
      "Sistema de delivery integrado",
      "Relatórios avançados",
      "Suporte prioritário",
      "Integração com sistemas de pagamento"
    ]
  },
  {
    id: "premium",
    nome: "Premium",
    preco: {
      mensal: 149.90,
      anual: 1439.90
    },
    descricao: "Solução completa para grandes estabelecimentos com necessidades avançadas.",
    recursos: [
      "Todos os recursos do plano Profissional",
      "Produtos ilimitados",
      "API para integrações personalizadas",
      "Relatórios detalhados e exportáveis",
      "Suporte dedicado 24/7",
      "Personalização completa da marca",
      "Gerenciamento de fidelidade",
      "Análise avançada de dados de clientes"
    ]
  }
];

export default function PlanosPage() {
  const [periodo, setPeriodo] = useState<"mensal" | "anual">("mensal");
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  
  const assinarPlano = () => {
    if (!planoSelecionado) {
      alert("Selecione um plano para continuar.");
      return;
    }
    
    const plano = planos.find(p => p.id === planoSelecionado);
    
    alert(`Você selecionou o plano ${plano?.nome} (${periodo}). Você será redirecionado para o pagamento.`);
    
    // Aqui seria implementada a lógica de redirecionamento para o checkout
  };

  const formatarPreco = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const calcularEconomia = (plano: Plano) => {
    const precoAnual = plano.preco.anual;
    const precoMensalTotal = plano.preco.mensal * 12;
    const economia = precoMensalTotal - precoAnual;
    const porcentagem = Math.round((economia / precoMensalTotal) * 100);
    
    return {
      valor: formatarPreco(economia),
      porcentagem
    };
  };

  return (
    <div className="container py-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Escolha o Plano Ideal para o Seu Negócio</h1>
        <p className="text-muted-foreground max-w-[700px] mx-auto">
          Selecione o plano que melhor atende às necessidades do seu estabelecimento e comece a transformar sua experiência digital hoje mesmo.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <Tabs 
          defaultValue="mensal" 
          value={periodo} 
          onValueChange={(value) => setPeriodo(value as "mensal" | "anual")}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
            <TabsTrigger value="anual">
              Anual
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Até 20% Off
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {planos.map((plano) => (
          <Card key={plano.id} className={`relative flex flex-col ${plano.destaque ? 'border-primary shadow-lg' : ''}`}>
            {plano.destaque && (
              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                Mais Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{plano.nome}</CardTitle>
              <CardDescription>{plano.descricao}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">
                    {formatarPreco(plano.preco[periodo])}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    /{periodo === "mensal" ? "mês" : "ano"}
                  </span>
                </div>
                {periodo === "anual" && (
                  <p className="text-sm text-green-600 mt-1">
                    Economia de {calcularEconomia(plano).valor} ({calcularEconomia(plano).porcentagem}%)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <RadioGroup value={planoSelecionado || ""} onValueChange={setPlanoSelecionado}>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value={plano.id} id={plano.id} />
                  <Label htmlFor={plano.id}>Selecionar este plano</Label>
                </div>
              </RadioGroup>
              <ul className="space-y-2 mt-6">
                {plano.recursos.map((recurso, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{recurso}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plano.destaque ? "default" : "outline"}
                onClick={() => {
                  setPlanoSelecionado(plano.id);
                  assinarPlano();
                }}
              >
                Assinar Plano
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-lg border bg-card p-6">
        <div className="flex items-start space-x-4">
          <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium mb-2">Precisa de ajuda para escolher?</h3>
            <p className="text-muted-foreground mb-4">
              Se você não tem certeza sobre qual plano é o ideal para o seu negócio, nossa equipe está pronta para ajudar.
              Entre em contato conosco e teremos prazer em orientá-lo na escolha do plano mais adequado às suas necessidades.
            </p>
            <Button variant="link" className="px-0">
              Fale com um especialista
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 