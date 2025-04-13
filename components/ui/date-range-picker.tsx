"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRangePickerProps {
  selected: {
    from: Date | null;
    to: Date | null;
  };
  onSelect: (range: { from: Date | null; to: Date | null }) => void;
  className?: string;
}

export function DatePickerWithRange({
  className,
  selected,
  onSelect,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selected.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected.from ? (
              selected.to ? (
                <>
                  {format(selected.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(selected.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(selected.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selected?.from}
            selected={{
              from: selected?.from || undefined,
              to: selected?.to || undefined,
            }}
            onSelect={(range) => {
              onSelect({
                from: range?.from || null,
                to: range?.to || null,
              });
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
} 