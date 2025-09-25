import log from "./logger";

// Exchange rates (in production, use a real API like exchangerate-api.com)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: {
    USD: 1,
    CAD: 1.35,
  },
  CAD: {
    CAD: 1,
    USD: 0.74,
  },
};

export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    log("INFO", "Converting currency", {
      amount,
      fromCurrency,
      toCurrency,
    });

    const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency];

    if (!rate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} to ${toCurrency}`
      );
    }

    const convertedAmount = Math.round(amount * rate * 100) / 100;

    log("INFO", "Currency conversion completed", {
      originalAmount: amount,
      convertedAmount,
      rate,
      fromCurrency,
      toCurrency,
    });

    return convertedAmount;
  } catch (error) {
    log("ERROR", "Currency conversion failed:", error);
    throw error;
  }
};

export const getSupportedCurrencies = (): string[] => {
  return Object.keys(EXCHANGE_RATES);
};

export const getExchangeRate = (
  fromCurrency: string,
  toCurrency: string
): number | null => {
  return EXCHANGE_RATES[fromCurrency]?.[toCurrency] || null;
};

export const formatCurrency = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};
