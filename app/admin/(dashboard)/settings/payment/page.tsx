"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DollarSign, Save } from "lucide-react";

interface PaymentMethodsState {
  onlinePaymentEnabled: boolean;
  delivery: {
    credit: boolean;
    debit: boolean;
    cash: boolean;
    pix: boolean;
    meal_voucher: boolean;
    food_voucher: boolean;
  };
  online: {
    credit: boolean;
    debit: boolean;
    pix: boolean;
    meal_voucher: boolean;
    food_voucher: boolean;
  };
}

export default function PaymentSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodsState>({
    onlinePaymentEnabled: true,
    delivery: {
      credit: true,
      debit: true,
      cash: true,
      pix: true,
      meal_voucher: true,
      food_voucher: true,
    },
    online: {
      credit: true,
      debit: true,
      pix: true,
      meal_voucher: true,
      food_voucher: true,
    }
  });

  const handlePaymentMethodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, type, value } = e.target;

    if (name === "onlinePaymentEnabled") {
      setPaymentMethods({
        ...paymentMethods,
        onlinePaymentEnabled: checked
      });
      return;
    }

    // Lidar com métodos de pagamento na entrega e online
    const [paymentType, method] = name.split('.');
    if (paymentType === 'delivery' || paymentType === 'online') {
      setPaymentMethods({
        ...paymentMethods,
        [paymentType]: {
          ...paymentMethods[paymentType],
          [method]: type === "checkbox" ? checked : value
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Métodos de pagamento salvos com sucesso!");
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Métodos de Pagamento</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Ativar/Desativar Pagamento Online */}
        <div className="flex items-center space-x-2 pb-4 border-b">
          <input
            type="checkbox"
            id="onlinePaymentEnabled"
            name="onlinePaymentEnabled"
            checked={paymentMethods.onlinePaymentEnabled}
            onChange={handlePaymentMethodsChange}
            className="rounded"
          />
          <label htmlFor="onlinePaymentEnabled" className="text-sm font-medium">
            Habilitar Pagamento Online
          </label>
        </div>

        {/* Pagamento na Entrega */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pagamento na Entrega</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_credit"
                name="delivery.credit"
                checked={paymentMethods.delivery.credit}
                onChange={handlePaymentMethodsChange}
                className="rounded"
              />
              <label htmlFor="delivery_credit" className="text-sm font-medium">
                Cartão de Crédito
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_debit"
                name="delivery.debit"
                checked={paymentMethods.delivery.debit}
                onChange={handlePaymentMethodsChange}
                className="rounded"
              />
              <label htmlFor="delivery_debit" className="text-sm font-medium">
                Cartão de Débito
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_cash"
                name="delivery.cash"
                checked={paymentMethods.delivery.cash}
                onChange={handlePaymentMethodsChange}
                className="rounded"
              />
              <label htmlFor="delivery_cash" className="text-sm font-medium">
                Dinheiro
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_pix"
                name="delivery.pix"
                checked={paymentMethods.delivery.pix}
                onChange={handlePaymentMethodsChange}
                className="rounded"
              />
              <label htmlFor="delivery_pix" className="text-sm font-medium">
                PIX
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_meal_voucher"
                name="delivery.meal_voucher"
                checked={paymentMethods.delivery.meal_voucher}
                onChange={handlePaymentMethodsChange}
                className="rounded"
              />
              <label htmlFor="delivery_meal_voucher" className="text-sm font-medium">
                Vale Refeição
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="delivery_food_voucher"
                name="delivery.food_voucher"
                checked={paymentMethods.delivery.food_voucher}
                onChange={handlePaymentMethodsChange}
                className="rounded"
              />
              <label htmlFor="delivery_food_voucher" className="text-sm font-medium">
                Vale Alimentação
              </label>
            </div>
          </div>
        </div>

        {paymentMethods.onlinePaymentEnabled && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pagamento Online</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="online_credit"
                  name="online.credit"
                  checked={paymentMethods.online.credit}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="online_credit" className="text-sm font-medium">
                  Cartão de Crédito
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="online_debit"
                  name="online.debit"
                  checked={paymentMethods.online.debit}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="online_debit" className="text-sm font-medium">
                  Cartão de Débito
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="online_pix"
                  name="online.pix"
                  checked={paymentMethods.online.pix}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="online_pix" className="text-sm font-medium">
                  PIX
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="online_meal_voucher"
                  name="online.meal_voucher"
                  checked={paymentMethods.online.meal_voucher}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="online_meal_voucher" className="text-sm font-medium">
                  Vale Refeição
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="online_food_voucher"
                  name="online.food_voucher"
                  checked={paymentMethods.online.food_voucher}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="online_food_voucher" className="text-sm font-medium">
                  Vale Alimentação
                </label>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md"
          >
            {isSubmitting ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Métodos de Pagamento
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
} 