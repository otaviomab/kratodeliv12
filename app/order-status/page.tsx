import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { Metadata } from "next";
import { 
  Clock, 
  Check, 
  ChevronRight, 
  MapPin,
  User,
  ClipboardCheck
} from "lucide-react";

export const metadata: Metadata = {
  title: "Status do Pedido | Krato",
  description: "Acompanhe o status do seu pedido em tempo real",
};

// Dados fictícios do pedido
const mockOrder = {
  id: "123456",
  number: 123,
  status: "preparing",
  statusHistory: [
    { status: "pending", timestamp: "2023-06-10T14:30:00Z" },
    { status: "confirmed", timestamp: "2023-06-10T14:35:00Z" },
    { status: "preparing", timestamp: "2023-06-10T14:40:00Z" },
  ],
  customerName: "João Silva",
  customerPhone: "(11) 99999-9999",
  customerAddress: {
    street: "Rua Exemplo",
    number: "123",
    complement: "Apto 101",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01001-000",
  },
  items: [
    {
      id: "1",
      productName: "Bruschetta",
      quantity: 2,
      unitPrice: 18.9,
      totalPrice: 37.8,
    },
    {
      id: "2",
      productName: "Picanha ao Ponto",
      quantity: 1,
      unitPrice: 72.9,
      totalPrice: 72.9,
    },
  ],
  subtotal: 110.7,
  deliveryFee: 5,
  total: 115.7,
  deliveryType: "delivery",
  paymentMethod: "credit_card",
  estimatedTime: 45,
  createdAt: "2023-06-10T14:30:00Z",
};

// Função auxiliar para obter status formatado
const getStatusInfo = (status: string) => {
  switch (status) {
    case "pending":
      return { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock };
    case "confirmed":
      return { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: Check };
    case "preparing":
      return { label: "Preparando", color: "bg-purple-100 text-purple-800", icon: Clock };
    case "ready":
      return { label: "Pronto", color: "bg-green-100 text-green-800", icon: Check };
    case "delivering":
      return { label: "Em entrega", color: "bg-orange-100 text-orange-800", icon: MapPin };
    case "delivered":
      return { label: "Entregue", color: "bg-green-100 text-green-800", icon: Check };
    case "canceled":
      return { label: "Cancelado", color: "bg-red-100 text-red-800", icon: Clock };
    default:
      return { label: "Desconhecido", color: "bg-gray-100 text-gray-800", icon: Clock };
  }
};

// Função auxiliar para formatar data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderStatusPage() {
  const currentStatus = getStatusInfo(mockOrder.status);
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Krato</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Pedido #{mockOrder.number}</h1>
                  <p className="text-muted-foreground">
                    Realizado em {new Date(mockOrder.createdAt).toLocaleDateString("pt-BR")} às{" "}
                    {formatDate(mockOrder.createdAt)}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${currentStatus.color}`}>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="h-5 w-5" />
                    <span className="font-medium">{currentStatus.label}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold mb-4">Progresso do pedido</h2>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-2.5 top-0 h-full w-0.5 bg-muted"></div>
                  {[
                    { status: "pending", label: "Pendente" },
                    { status: "confirmed", label: "Confirmado" },
                    { status: "preparing", label: "Preparando" },
                    { status: "ready", label: "Pronto" },
                    { status: "delivering", label: "Em entrega" },
                    { status: "delivered", label: "Entregue" },
                  ].map((step) => {
                    const statusHistory = mockOrder.statusHistory.find(
                      (h) => h.status === step.status
                    );
                    const isCompleted = statusHistory !== undefined;
                    const isCurrent = mockOrder.status === step.status;

                    return (
                      <div key={step.status} className="relative mb-4 flex items-start">
                        <div
                          className={`absolute flex h-5 w-5 items-center justify-center rounded-full ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          } text-xs font-medium`}
                        >
                          {isCompleted && <Check className="h-3 w-3" />}
                        </div>
                        <div className="ml-10">
                          <p
                            className={`text-sm font-medium ${
                              isCurrent ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          {statusHistory && (
                            <p className="text-xs text-muted-foreground">
                              {formatDate(statusHistory.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {mockOrder.deliveryType === "delivery" ? (
                    <>
                      Tempo estimado de entrega:{" "}
                      <span className="font-medium">{mockOrder.estimatedTime} minutos</span>
                    </>
                  ) : (
                    <>
                      Tempo estimado para retirada:{" "}
                      <span className="font-medium">{mockOrder.estimatedTime} minutos</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <User className="mr-2 h-5 w-5 text-muted-foreground" />
                  Informações do cliente
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Nome:</strong> {mockOrder.customerName}
                  </p>
                  <p className="text-sm">
                    <strong>Telefone:</strong> {mockOrder.customerPhone}
                  </p>
                </div>
              </div>

              {mockOrder.deliveryType === "delivery" && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                    Endereço de entrega
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm">
                      {mockOrder.customerAddress.street}, {mockOrder.customerAddress.number}
                      {mockOrder.customerAddress.complement &&
                        `, ${mockOrder.customerAddress.complement}`}
                    </p>
                    <p className="text-sm">
                      {mockOrder.customerAddress.neighborhood}, {mockOrder.customerAddress.city} -{" "}
                      {mockOrder.customerAddress.state}
                    </p>
                    <p className="text-sm">{mockOrder.customerAddress.zipCode}</p>
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <ClipboardCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                  Informações do pedido
                </h2>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Tipo de entrega:</strong>{" "}
                    {mockOrder.deliveryType === "delivery" ? "Entrega" : "Retirada"}
                  </p>
                  <p className="text-sm">
                    <strong>Forma de pagamento:</strong>{" "}
                    {mockOrder.paymentMethod === "credit_card"
                      ? "Cartão de crédito"
                      : mockOrder.paymentMethod === "debit_card"
                      ? "Cartão de débito"
                      : mockOrder.paymentMethod === "pix"
                      ? "PIX"
                      : "Dinheiro"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Itens do pedido</h2>
              <div className="divide-y">
                {mockOrder.items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.quantity}x {item.productName}
                      </p>
                    </div>
                    <p className="text-right">{formatPrice(item.totalPrice)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(mockOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de entrega</span>
                  <span>{formatPrice(mockOrder.deliveryFee)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatPrice(mockOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-primary hover:text-primary/90 flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
              Voltar para o cardápio
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t py-6 mt-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Krato. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 