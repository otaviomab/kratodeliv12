"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, DollarSign, MapPin, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  // Estados para os formulários
  const [generalInfo, setGeneralInfo] = useState({
    name: "Restaurante Demo",
    description: "O melhor restaurante da cidade com pratos deliciosos e ambiente aconchegante.",
    slug: "restaurante-demo",
    phone: "(11) 98765-4321",
    whatsapp: "(11) 98765-4321",
    email: "contato@restaurantedemo.com.br",
    website: "https://www.restaurantedemo.com.br"
  });

  const [address, setAddress] = useState({
    street: "Rua das Flores",
    number: "123",
    complement: "Sala 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipcode: "01234-567"
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: true, start: "11:00", end: "22:00" },
    tuesday: { open: true, start: "11:00", end: "22:00" },
    wednesday: { open: true, start: "11:00", end: "22:00" },
    thursday: { open: true, start: "11:00", end: "22:00" },
    friday: { open: true, start: "11:00", end: "23:00" },
    saturday: { open: true, start: "11:00", end: "23:00" },
    sunday: { open: true, start: "12:00", end: "22:00" }
  });

  const [deliverySettings, setDeliverySettings] = useState({
    deliveryEnabled: true,
    pickupEnabled: true,
    minimumOrderValue: "20",
    deliveryFee: "5",
    freeDeliveryOver: "50",
    deliveryTimeMinutes: "45",
    deliveryRadius: "5"
  });

  const [paymentMethods, setPaymentMethods] = useState({
    credit: true,
    debit: true,
    cash: true,
    pix: true,
    pixKey: "12345678900"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers dos formulários
  const handleGeneralInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralInfo({ ...generalInfo, [name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day as keyof typeof businessHours],
        [field]: value
      }
    });
  };

  const handleDeliverySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDeliverySettings({
      ...deliverySettings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handlePaymentMethodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, type, value } = e.target;
    setPaymentMethods({
      ...paymentMethods,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Função para salvar as configurações
  const handleSubmit = (e: React.FormEvent, section: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Configurações de ${section} salvas com sucesso!`);
    }, 1000);
  };

  // Renderização de dias da semana em português
  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      monday: "Segunda-feira",
      tuesday: "Terça-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "Sábado",
      sunday: "Domingo"
    };
    return days[day] || day;
  };

  // Estados brasileiros para o select
  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

      {/* Informações Gerais */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Informações Gerais</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, "informações gerais")} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome do Estabelecimento
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={generalInfo.name}
                  onChange={handleGeneralInfoChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={generalInfo.description}
                  onChange={handleGeneralInfoChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                  URL do Cardápio (slug)
                </label>
                <div className="flex items-center">
                  <span className="text-muted-foreground text-sm mr-1">seusite.com/cardapio/</span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={generalInfo.slug}
                    onChange={handleGeneralInfoChange}
                    className="flex-1 px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={generalInfo.phone}
                  onChange={handleGeneralInfoChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium mb-1">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="text"
                  value={generalInfo.whatsapp}
                  onChange={handleGeneralInfoChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={generalInfo.email}
                  onChange={handleGeneralInfoChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-1">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={generalInfo.website}
                  onChange={handleGeneralInfoChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Informações
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Endereço */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Endereço</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, "endereço")} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <label htmlFor="street" className="block text-sm font-medium mb-1">
                Rua/Avenida
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={address.street}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-4">
              <label htmlFor="number" className="block text-sm font-medium mb-1">
                Número
              </label>
              <input
                id="number"
                name="number"
                type="text"
                value={address.number}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-6">
              <label htmlFor="complement" className="block text-sm font-medium mb-1">
                Complemento
              </label>
              <input
                id="complement"
                name="complement"
                type="text"
                value={address.complement}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="md:col-span-6">
              <label htmlFor="neighborhood" className="block text-sm font-medium mb-1">
                Bairro
              </label>
              <input
                id="neighborhood"
                name="neighborhood"
                type="text"
                value={address.neighborhood}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-5">
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                Cidade
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-3">
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                Estado
              </label>
              <select
                id="state"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Selecione</option>
                {brazilianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-4">
              <label htmlFor="zipcode" className="block text-sm font-medium mb-1">
                CEP
              </label>
              <input
                id="zipcode"
                name="zipcode"
                type="text"
                value={address.zipcode}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Endereço
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Horário de Funcionamento */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Horário de Funcionamento</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, "horário de funcionamento")} className="space-y-4">
          <div className="space-y-4">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div key={day} className="flex items-center space-x-4">
                <div className="w-32 md:w-40">
                  <span className="text-sm font-medium">{getDayName(day)}</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${day}-open`}
                    checked={hours.open}
                    onChange={(e) => handleBusinessHoursChange(day, "open", e.target.checked)}
                    className="mr-2 rounded"
                  />
                  <label htmlFor={`${day}-open`} className="text-sm">
                    Aberto
                  </label>
                </div>
                
                {hours.open && (
                  <>
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`${day}-start`} className="text-sm">
                        Das
                      </label>
                      <input
                        type="time"
                        id={`${day}-start`}
                        value={hours.start}
                        onChange={(e) => handleBusinessHoursChange(day, "start", e.target.value)}
                        className="px-2 py-1 border rounded-md text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`${day}-end`} className="text-sm">
                        Até
                      </label>
                      <input
                        type="time"
                        id={`${day}-end`}
                        value={hours.end}
                        onChange={(e) => handleBusinessHoursChange(day, "end", e.target.value)}
                        className="px-2 py-1 border rounded-md text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Horários
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Configurações de Entrega */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Configurações de Entrega</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, "entrega")} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="deliveryEnabled"
                  name="deliveryEnabled"
                  checked={deliverySettings.deliveryEnabled}
                  onChange={handleDeliverySettingsChange}
                  className="rounded"
                />
                <label htmlFor="deliveryEnabled" className="text-sm font-medium">
                  Habilitar entrega
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pickupEnabled"
                  name="pickupEnabled"
                  checked={deliverySettings.pickupEnabled}
                  onChange={handleDeliverySettingsChange}
                  className="rounded"
                />
                <label htmlFor="pickupEnabled" className="text-sm font-medium">
                  Habilitar retirada no local
                </label>
              </div>
              
              <div>
                <label htmlFor="deliveryRadius" className="block text-sm font-medium mb-1">
                  Raio de Entrega (km)
                </label>
                <input
                  type="number"
                  id="deliveryRadius"
                  name="deliveryRadius"
                  value={deliverySettings.deliveryRadius}
                  onChange={handleDeliverySettingsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="deliveryTimeMinutes" className="block text-sm font-medium mb-1">
                  Tempo médio de entrega (minutos)
                </label>
                <input
                  type="number"
                  id="deliveryTimeMinutes"
                  name="deliveryTimeMinutes"
                  value={deliverySettings.deliveryTimeMinutes}
                  onChange={handleDeliverySettingsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="minimumOrderValue" className="block text-sm font-medium mb-1">
                  Valor mínimo do pedido (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="minimumOrderValue"
                  name="minimumOrderValue"
                  value={deliverySettings.minimumOrderValue}
                  onChange={handleDeliverySettingsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="deliveryFee" className="block text-sm font-medium mb-1">
                  Taxa de entrega (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="deliveryFee"
                  name="deliveryFee"
                  value={deliverySettings.deliveryFee}
                  onChange={handleDeliverySettingsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="freeDeliveryOver" className="block text-sm font-medium mb-1">
                  Entrega grátis acima de (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="freeDeliveryOver"
                  name="freeDeliveryOver"
                  value={deliverySettings.freeDeliveryOver}
                  onChange={handleDeliverySettingsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              {isSubmitting ? (
                <>Salvando...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações de Entrega
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Métodos de Pagamento */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Métodos de Pagamento</h2>
        </div>
        
        <form onSubmit={(e) => handleSubmit(e, "métodos de pagamento")} className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="credit"
                  name="credit"
                  checked={paymentMethods.credit}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="credit" className="text-sm font-medium">
                  Cartão de Crédito
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="debit"
                  name="debit"
                  checked={paymentMethods.debit}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="debit" className="text-sm font-medium">
                  Cartão de Débito
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cash"
                  name="cash"
                  checked={paymentMethods.cash}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="cash" className="text-sm font-medium">
                  Dinheiro
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pix"
                  name="pix"
                  checked={paymentMethods.pix}
                  onChange={handlePaymentMethodsChange}
                  className="rounded"
                />
                <label htmlFor="pix" className="text-sm font-medium">
                  PIX
                </label>
              </div>
            </div>
            
            {paymentMethods.pix && (
              <div>
                <label htmlFor="pixKey" className="block text-sm font-medium mb-1">
                  Chave PIX
                </label>
                <input
                  type="text"
                  id="pixKey"
                  name="pixKey"
                  value={paymentMethods.pixKey}
                  onChange={handlePaymentMethodsChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
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
      </div>
    </div>
  );
} 