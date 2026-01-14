import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { SwapForm } from './components/SwapForm';
import { WalletBalance } from './components/WalletBalance';
import { useWalletStore } from './store/useWalletStore';

export default function App() {
  const { fetchExchangeRates, isLoading, error } = useWalletStore();

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white/60">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-amber-500/20 border border-amber-500/50 rounded-xl p-6">
          <p className="text-amber-400 font-medium mb-2">Failed to load exchange rates</p>
          <p className="text-white/60 text-sm">{error}</p>
          <button
            onClick={() => fetchExchangeRates()}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="flex gap-6 items-start max-w-4xl w-full">
        {/* Left - Swap Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Token Swap
            </h1>
            <p className="text-white/60">Exchange tokens instantly</p>
          </div>

          <SwapForm />
        </motion.div>

        {/* Right - Wallet */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-80 flex-shrink-0"
        >
          <WalletBalance />
        </motion.div>
      </div>
    </div>
  );
}
