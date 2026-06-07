import type { CoinSearchResult, PricesMap } from '../types';

// Dev uses Vite proxy; production calls CoinGecko directly (CORS allowed).
const BASE = import.meta.env.DEV
  ? '/api/coingecko'
  : 'https://api.coingecko.com/api/v3';

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    throw new Error(`CoinGecko error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

type SearchResponse = {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
  }>;
};

type PriceResponse = Record<
  string,
  {
    usd: number;
    usd_24h_change?: number;
  }
>;

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  if (!query.trim()) return [];
  const data = await fetchJson<SearchResponse>(
    `/search?query=${encodeURIComponent(query.trim())}`,
  );
  return data.coins.slice(0, 5).map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    thumb: coin.thumb,
  }));
}

export async function fetchPrices(coinIds: string[]): Promise<PricesMap> {
  if (coinIds.length === 0) return {};

  const data = await fetchJson<PriceResponse>(
    `/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`,
  );

  const prices: PricesMap = {};
  for (const id of coinIds) {
    const entry = data[id];
    if (entry) {
      prices[id] = {
        usd: entry.usd,
        usd_24h_change: entry.usd_24h_change ?? 0,
      };
    }
  }
  return prices;
}
