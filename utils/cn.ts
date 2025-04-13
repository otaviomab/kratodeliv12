import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS usando clsx e tailwind-merge para evitar conflitos de classes do Tailwind
 * 
 * @param inputs Classes CSS a serem combinadas
 * @returns String com as classes combinadas e sem conflitos
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 