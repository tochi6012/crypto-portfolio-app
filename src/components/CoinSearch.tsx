import { useEffect, useState } from 'react';
import { searchCoins } from '../api/coingecko';
import type { CoinSearchResult } from '../types';

type CoinSearchProps = {
  onSelect: (coin: CoinSearchResult | null) => void;
  selected: CoinSearchResult | null;
};

export function CoinSearch({ onSelect, selected }: CoinSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim() || selected) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const coins = await searchCoins(query);
        setResults(coins);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selected]);

  if (selected) {
    return (
      <div className="selected-coin">
        <img src={selected.thumb} alt="" width={32} height={32} />
        <div>
          <div className="selected-coin-name">{selected.name}</div>
          <div className="selected-coin-symbol">{selected.symbol}</div>
        </div>
        <button
          type="button"
          className="action-btn"
          onClick={() => {
            onSelect(null);
            setQuery('');
          }}
          aria-label="Clear selection"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="coin-search">
      <input
        type="search"
        className="input"
        placeholder="Search coin (BTC, ETH...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      {searching && <div className="search-status">Searching...</div>}
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((coin) => (
            <li key={coin.id}>
              <button
                type="button"
                className="search-result-btn"
                onClick={() => {
                  onSelect(coin);
                  setResults([]);
                }}
              >
                <img src={coin.thumb} alt="" width={28} height={28} />
                <span className="result-name">{coin.name}</span>
                <span className="result-symbol">{coin.symbol}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
