import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../store/useWalletStore';
import { tokenIcons } from '../constants';

interface WalletTokenDisplay {
  currency: string;
  amount: number;
  price: number;
  icon: string;
  usdValue: number;
}

export function WalletBalance() {
  const [imgError, setImgError] = useState<Set<string>>(new Set());
  const { walletTokens, exchangeRates } = useWalletStore();

  const walletTokensDisplay = useMemo(() => {
    const priceMap = new Map<string, number>();
    exchangeRates.forEach((rate) => {
      if (!priceMap.has(rate.currency)) {
        priceMap.set(rate.currency, rate.price);
      }
    });

    return walletTokens
      .map((token) => {
        const price = priceMap.get(token.currency) || 0;
        const icon = tokenIcons[token.currency] || '';
        return {
          currency: token.currency,
          amount: token.amount,
          price,
          icon,
          usdValue: token.amount * price,
        };
      })
      .sort((a, b) => b.usdValue - a.usdValue);
  }, [walletTokens, exchangeRates]);

  const totalUsdValue = useMemo(() => {
    return walletTokensDisplay.reduce((sum, token) => sum + token.usdValue, 0);
  }, [walletTokensDisplay]);

  const handleImgError = (currency: string) => {
    setImgError((prev) => new Set(prev).add(currency));
  };

  const TokenIcon = ({ token, size = 28 }: { token: WalletTokenDisplay; size?: number }) => {
    if (imgError.has(token.currency) || !token.icon) {
      return (
        <div
          className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white flex-shrink-0"
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          {token.currency.slice(0, 2)}
        </div>
      );
    }
    return (
      <img
        src={token.icon}
        alt={token.currency}
        width={size}
        height={size}
        className="rounded-full flex-shrink-0"
        onError={() => handleImgError(token.currency)}
      />
    );
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col h-[520px]">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className="text-white font-semibold">My Wallet</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50">Total Balance</p>
          <p className="text-lg font-bold text-white">
            ${totalUsdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Token List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
        {walletTokensDisplay.map((token, index) => (
          <motion.div
            key={token.currency}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.02 }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <TokenIcon token={token} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate text-sm">{token.currency}</p>
              <p className="text-xs text-white/50">
                ${token.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-medium text-white text-sm">
                {token.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </p>
              <p className="text-xs text-white/50">
                ${token.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer - Fixed */}
      <div className="p-3 border-t border-white/10">
        <p className="text-center text-xs text-white/40">
          {walletTokensDisplay.length} tokens
        </p>
      </div>
    </div>
  );
}
