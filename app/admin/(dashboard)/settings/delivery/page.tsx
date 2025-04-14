"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Save, Plus, X } from "lucide-react";

interface DeliveryZone {
  id: string;
  minDistance: number;
  maxDistance: number;
  fee: number;
  deliveryTime: number; // tempo em minutos
}

export default function DeliverySettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryEnabled: true,
    pickupEnabled: true,
    minimumOrderValue: "20",
    deliveryTimeMinutes: "45",
    maxDeliveryRadius: "10",
    zones: [
      { id: "1", minDistance: 0, maxDistance: 2, fee: 0, deliveryTime: 30 },
      { id: "2", minDistance: 2, maxDistance: 5, fee: 5, deliveryTime: 45 },
      { id: "3", minDistance: 5, maxDistance: 10, fee: 8, deliveryTime: 60 }
    ] as DeliveryZone[]
  });

  const handleDeliverySettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDeliverySettings({
      ...deliverySettings,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleZoneChange = (zoneId: string, field: keyof DeliveryZone, value: number) => {
    setDeliverySettings({
      ...deliverySettings,
      zones: deliverySettings.zones.map(zone =>
        zone.id === zoneId ? { ...zone, [field]: value } : zone
      )
    });
  };

  const addDeliveryZone = () => {
    const newId = String(deliverySettings.zones.length + 1);
    const lastZone = deliverySettings.zones[deliverySettings.zones.length - 1];
    const newMinDistance = lastZone ? lastZone.maxDistance : 0;
    
    setDeliverySettings({
      ...deliverySettings,
      zones: [
        ...deliverySettings.zones,
        {
          id: newId,
          minDistance: newMinDistance,
          maxDistance: newMinDistance + 2,
          fee: 0,
          deliveryTime: 30
        }
      ]
    });
  };

  const removeDeliveryZone = (zoneId: string) => {
    setDeliverySettings({
      ...deliverySettings,
      zones: deliverySettings.zones.filter(zone => zone.id !== zoneId)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Configurações de entrega salvas com sucesso!");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Configurações de Entrega</h1>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          onClick={handleSubmit}
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações Básicas */}
        <div className="bg-white rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] space-y-6">
          <h2 className="text-lg font-semibold mb-4">Configurações Básicas</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-[#fcf8f2] rounded-md">
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
            
            <div className="flex items-center space-x-2 p-3 bg-[#fcf8f2] rounded-md">
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
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="maxDeliveryRadius" className="block text-sm font-medium mb-2">
                Raio máximo de entrega (km)
              </label>
              <input
                type="number"
                id="maxDeliveryRadius"
                name="maxDeliveryRadius"
                value={deliverySettings.maxDeliveryRadius}
                onChange={handleDeliverySettingsChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="deliveryTimeMinutes" className="block text-sm font-medium mb-2">
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

            <div>
              <label htmlFor="minimumOrderValue" className="block text-sm font-medium mb-2">
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
          </div>
        </div>

        {/* Zonas de Entrega */}
        <div className="bg-white rounded-lg border border-border/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Zonas de Entrega</h2>
            <button
              type="button"
              onClick={addDeliveryZone}
              className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Adicionar Zona
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {deliverySettings.zones.map((zone, index) => (
              <div
                key={zone.id}
                className="bg-[#fcf8f2] p-4 rounded-lg border border-border/5 relative"
              >
                <div className="absolute top-3 right-3">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeDeliveryZone(zone.id)}
                      className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Distância Mínima (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={zone.minDistance}
                      onChange={(e) => handleZoneChange(zone.id, 'minDistance', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Distância Máxima (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={zone.maxDistance}
                      onChange={(e) => handleZoneChange(zone.id, 'maxDistance', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Taxa de Entrega (R$)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={zone.fee}
                      onChange={(e) => handleZoneChange(zone.id, 'fee', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tempo de Entrega (min)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={zone.deliveryTime}
                      onChange={(e) => handleZoneChange(zone.id, 'deliveryTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 