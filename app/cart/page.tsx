import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/utils/formatPrice";
import { DELIVERY_TYPES, PAYMENT_METHODS } from "@/shared/constants";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrinho de Compras | Krato",
  description: "Finalize seu pedido no Restaurante Demo",
};

// Dados fictícios do carrinho
interface CartItemAdditional {
  name: string;
  options: Array<{
    name: string;
    price: number;
  }>;
}

const mockCart = {
  items: [
    {
      id: "1",
      productId: "1",
      productName: "Bruschetta",
      quantity: 2,
      unitPrice: 18.9,
      totalPrice: 37.8,
      additionals: [] as CartItemAdditional[],
    },
    {
      id: "2",
      productId: "3",
      productName: "Picanha ao Ponto",
      quantity: 1,
      unitPrice: 72.9,
      totalPrice: 72.9,
      additionals: [],
    },
  ],
  subtotal: 110.7,
  deliveryFee: 5,
  total: 115.7,
  deliveryType: "delivery" as const,
  customerName: "",
  customerPhone: "",
  customerAddress: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  paymentMethod: "",
  establishmentId: "1",
};

const mockEstablishment = {
  id: "1",
  name: "Restaurante Demo",
  slug: "restaurante-demo",
  logoUrl: "",
  isOpen: true,
};

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href={`/cardapio/${mockEstablishment.slug}`} className="flex items-center">
              {mockEstablishment.logoUrl ? (
                <img
                  src={mockEstablishment.logoUrl}
                  alt={mockEstablishment.name}
                  className="h-10 w-10 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white mr-2">
                  <span className="text-lg font-bold">{mockEstablishment.name.charAt(0)}</span>
                </div>
              )}
              <span className="text-lg font-semibold">{mockEstablishment.name}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna principal */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Seu Carrinho</h1>
              <Link
                href={`/cardapio/${mockEstablishment.slug}`}
                className="text-sm text-primary hover:text-primary/90"
              >
                Adicionar mais itens
              </Link>
            </div>

            {mockCart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
                <p className="text-muted-foreground mb-6">
                  Adicione alguns itens para começar seu pedido
                </p>
                <Link href={`/cardapio/${mockEstablishment.slug}`}>
                  <Button>Ver Cardápio</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockCart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName}</h3>
                      {item.additionals.length > 0 && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          <p>Adicionais:</p>
                          <ul className="ml-4 list-disc">
                            {item.additionals.map((additional, index) => (
                              <li key={index}>
                                {additional.name}
                                {additional.options.map((option, i) => (
                                  <span key={i}>
                                    {option.name} (+{formatPrice(option.price)})
                                  </span>
                                ))}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            className="flex items-center justify-center w-8 h-8 text-foreground hover:bg-muted"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            className="flex items-center justify-center w-8 h-8 text-foreground hover:bg-muted"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="flex items-center text-sm text-red-500 hover:text-red-700"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remover
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4 text-right">
                      <p className="font-medium">{formatPrice(item.totalPrice)}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mockCart.items.length > 0 && (
              <div className="space-y-6 mt-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Informações do pedido</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Seu nome
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Nome completo"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Telefone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Forma de entrega</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DELIVERY_TYPES.map((type) => (
                      <div
                        key={type.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                          mockCart.deliveryType === type.id
                            ? "bg-primary/10 border-primary"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          id={`delivery_${type.id}`}
                          name="delivery_type"
                          value={type.id}
                          className="h-4 w-4 text-primary border-input"
                          checked={mockCart.deliveryType === type.id}
                          readOnly
                        />
                        <label
                          htmlFor={`delivery_${type.id}`}
                          className="ml-2 block text-sm font-medium"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {mockCart.deliveryType === "delivery" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Endereço de entrega</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          CEP
                        </label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          placeholder="00000-000"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label
                          htmlFor="search"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          &nbsp;
                        </label>
                        <Button className="w-full">Buscar</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Rua
                        </label>
                        <Input
                          id="street"
                          name="street"
                          placeholder="Rua Exemplo"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="number"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Número
                        </label>
                        <Input
                          id="number"
                          name="number"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          htmlFor="complement"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Complemento (opcional)
                        </label>
                        <Input
                          id="complement"
                          name="complement"
                          placeholder="Apto 101"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="neighborhood"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Bairro
                        </label>
                        <Input
                          id="neighborhood"
                          name="neighborhood"
                          placeholder="Centro"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Cidade
                        </label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="São Paulo"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Estado
                        </label>
                        <Input
                          id="state"
                          name="state"
                          placeholder="SP"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-semibold mb-4">Forma de pagamento</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PAYMENT_METHODS.map((method) => (
                      <div
                        key={method.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                          mockCart.paymentMethod === method.id
                            ? "bg-primary/10 border-primary"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          id={`payment_${method.id}`}
                          name="payment_method"
                          value={method.id}
                          className="h-4 w-4 text-primary border-input"
                          checked={mockCart.paymentMethod === method.id}
                          readOnly
                        />
                        <label
                          htmlFor={`payment_${method.id}`}
                          className="ml-2 block text-sm font-medium"
                        >
                          {method.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    Observações (opcional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Alguma instrução especial para o pedido?"
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* Resumo do pedido */}
          {mockCart.items.length > 0 && (
            <div className="w-full md:w-80 lg:w-96">
              <div className="bg-card border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(mockCart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span>{formatPrice(mockCart.deliveryFee)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatPrice(mockCart.total)}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6">Finalizar pedido</Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Ao finalizar o pedido, você concorda com nossos{" "}
                  <Link href="/termos" className="text-primary hover:text-primary/90">
                    Termos de Serviço
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-card border-t py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {mockEstablishment.name}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 