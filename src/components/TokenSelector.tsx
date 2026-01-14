import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Token } from '../hooks/useTokens';

interface TokenSelectorProps {
  tokens: Token[];
  selected: Token | null;
  onSelect: (token: Token) => void;
  disabled?: boolean;
}

export function TokenSelector({ tokens, selected, onSelect, disabled }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [imgError, setImgError] = useState<Set<string>>(new Set());
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if dropdown should open upward
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 320; // max-h-64 (256px) + search (64px)
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < dropdownHeight);
    }
  }, [isOpen]);

  const filteredTokens = tokens.filter((t) =>
    t.currency.toLowerCase().includes(search.toLowerCase())
  );

  const handleImgError = (currency: string) => {
    setImgError((prev) => new Set(prev).add(currency));
  };

  const TokenIcon = ({ token, size = 32 }: { token: Token; size?: number }) => {
    if (imgError.has(token.currency)) {
      return (
        <div
          className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-white"
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
        className="rounded-full"
        onError={() => handleImgError(token.currency)}
      />
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
      >
        {selected ? (
          <>
            <TokenIcon token={selected} size={24} />
            <span className="font-semibold text-white">{selected.currency}</span>
          </>
        ) : (
          <span className="text-white/60">Select</span>
        )}
        <svg
          className={`ml-auto w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-64 right-0 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${
              openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <div className="p-3 border-b border-white/10">
              <input
                type="text"
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto scrollbar-hide">
              {filteredTokens.length === 0 ? (
                <div className="px-4 py-6 text-center text-white/40 text-sm">No tokens found</div>
              ) : (
                filteredTokens.map((token) => (
                  <button
                    key={token.currency}
                    type="button"
                    onClick={() => {
                      onSelect(token);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                      selected?.currency === token.currency ? 'bg-violet-500/20' : ''
                    }`}
                  >
                    <TokenIcon token={token} size={36} />
                    <div className="text-left flex-1">
                      <div className="font-medium text-white">{token.currency}</div>
                      <div className="text-xs text-white/50">${token.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                    </div>
                    {selected?.currency === token.currency && (
                      <svg className="w-5 h-5 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
