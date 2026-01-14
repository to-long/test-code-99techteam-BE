import { useMemo } from 'react';
import { useWalletStore } from '../store/useWalletStore';
import { tokenIcons } from '../constants';

export interface Token {
  currency: string;
  price: number;
  icon: string;
}

export function useTokens() {
  const exchangeRates = useWalletStore((state) => state.exchangeRates);

  const tokens = useMemo(() => {
    // Get unique tokens with their prices
    const priceMap = new Map<string, number>();

    exchangeRates.forEach((rate) => {
      // Use the first price we encounter for each currency
      if (!priceMap.has(rate.currency)) {
        priceMap.set(rate.currency, rate.price);
      }
    });

    // Only include tokens that have both an icon and a price
    const tokenList: Token[] = [];

    Object.entries(tokenIcons).forEach(([currency, icon]) => {
      const price = priceMap.get(currency);
      if (price !== undefined) {
        tokenList.push({ currency, price, icon });
      }
    });

    // Sort by price (highest first)
    return tokenList.sort((a, b) => b.price - a.price);
  }, [exchangeRates]);

  return tokens;
}
