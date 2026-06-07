export type Holding = {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
};

export type PriceData = {
  usd: number;
  usd_24h_change: number;
};

export type CoinSearchResult = {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
};

export type PricesMap = Record<string, PriceData>;
