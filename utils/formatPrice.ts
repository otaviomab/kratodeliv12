/**
 * Formata um número para o formato de moeda em reais (BRL)
 * 
 * @param price Valor a ser formatado
 * @param options Opções de formatação
 * @returns String formatada no padrão de moeda brasileira
 */
export function formatPrice(
  price: number,
  options: {
    currency?: string;
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
): string {
  const { currency = "BRL", notation = "standard" } = options;

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  });

  return formatter.format(price);
} 