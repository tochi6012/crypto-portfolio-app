import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPrices } from '../api/coingecko';
import type { PricesMap } from '../types';

const POLL_INTERVAL_MS = 60_000;

export function usePrices(coinIds: string[]) {
  const [prices, setPrices] = useState<PricesMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const stalePrices = useRef<PricesMap>({});

  const idsKey = coinIds.slice().sort().join(',');

  const refresh = useCallback(async () => {
    if (coinIds.length === 0) {
      setPrices({});
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPrices(coinIds);
      stalePrices.current = data;
      setPrices(data);
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(message);
      if (Object.keys(stalePrices.current).length > 0) {
        setPrices(stalePrices.current);
      }
    } finally {
      setLoading(false);
    }
  }, [idsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { prices, loading, error, lastUpdated, refresh };
}
