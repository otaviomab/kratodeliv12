"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Save } from "lucide-react";

export default function AddressSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState({
    street: "Rua das Flores",
    number: "123",
    complement: "Sala 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipcode: "01234-567"
  });

  // Estados brasileiros para o select
  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Endereço salvo com sucesso!");
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Endereço</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="street" className="block text-sm font-medium mb-1">
              Rua
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
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
            
            <div>
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
          </div>
          
          <div>
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
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
            
            <div>
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
                <option value="">Selecione...</option>
                {brazilianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
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
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md"
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
    </>
  );
} 