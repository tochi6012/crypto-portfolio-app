import { useCallback, useEffect, useState } from 'react';
import type { Holding } from '../types';

const STORAGE_KEY = 'crypto-portfolio-holdings';

function loadHoldings(): Holding[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Holding[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHoldings(holdings: Holding[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
}

export function useHoldings() {
  const [holdings, setHoldings] = useState<Holding[]>(loadHoldings);

  useEffect(() => {
    saveHoldings(holdings);
  }, [holdings]);

  const addHolding = useCallback((holding: Omit<Holding, 'id'>) => {
    setHoldings((prev) => {
      const existing = prev.find((h) => h.coinId === holding.coinId);
      if (existing) {
        return prev.map((h) =>
          h.coinId === holding.coinId
            ? { ...h, amount: h.amount + holding.amount }
            : h,
        );
      }
      return [...prev, { ...holding, id: crypto.randomUUID() }];
    });
  }, []);

  const updateHolding = useCallback((id: string, amount: number) => {
    setHoldings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, amount } : h)),
    );
  }, []);

  const removeHolding = useCallback((id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return { holdings, addHolding, updateHolding, removeHolding };
}
