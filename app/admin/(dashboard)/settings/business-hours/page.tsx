"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Save } from "lucide-react";

export default function BusinessHoursSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessHours, setBusinessHours] = useState({
    monday: { open: true, start: "11:00", end: "22:00" },
    tuesday: { open: true, start: "11:00", end: "22:00" },
    wednesday: { open: true, start: "11:00", end: "22:00" },
    thursday: { open: true, start: "11:00", end: "22:00" },
    friday: { open: true, start: "11:00", end: "23:00" },
    saturday: { open: true, start: "11:00", end: "23:00" },
    sunday: { open: true, start: "12:00", end: "22:00" }
  });

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

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day as keyof typeof businessHours],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de salvamento
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Horários de funcionamento salvos com sucesso!");
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Horário de Funcionamento</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(businessHours).map(([day, hours]) => (
          <div key={day} className="flex items-center gap-4">
            <div className="w-40">
              <span className="font-medium">{getDayName(day)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hours.open}
                onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Aberto</span>
            </div>
            
            {hours.open && (
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={hours.start}
                  onChange={(e) => handleBusinessHoursChange(day, 'start', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
                <span>até</span>
                <input
                  type="time"
                  value={hours.end}
                  onChange={(e) => handleBusinessHoursChange(day, 'end', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
            )}
          </div>
        ))}
        
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
                Salvar Horários
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
} 