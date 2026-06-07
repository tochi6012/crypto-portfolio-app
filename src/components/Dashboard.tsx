import type { Holding, PricesMap } from '../types';
import { formatPercent, formatTime, formatUsd } from '../utils/format';

type DashboardProps = {
  holdings: Holding[];
  prices: PricesMap;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
};

function computePortfolioStats(holdings: Holding[], prices: PricesMap) {
  let total = 0;
  let weightedChange = 0;

  for (const holding of holdings) {
    const price = prices[holding.coinId];
    if (!price) continue;
    const value = holding.amount * price.usd;
    total += value;
    weightedChange += value * price.usd_24h_change;
  }

  const change24h = total > 0 ? weightedChange / total : 0;
  return { total, change24h };
}

export function Dashboard({
  holdings,
  prices,
  lastUpdated,
  loading,
  error,
  onRefresh,
}: DashboardProps) {
  const { total, change24h } = computePortfolioStats(holdings, prices);
  const isPositive = change24h >= 0;

  return (
    <header className="dashboard">
      <div className="dashboard-label">Total Portfolio</div>
      <div className="dashboard-total">{formatUsd(total)}</div>
      {holdings.length > 0 && (
        <div className={`dashboard-change ${isPositive ? 'positive' : 'negative'}`}>
          24h {formatPercent(change24h)}
        </div>
      )}
      <div className="dashboard-meta">
        {lastUpdated && (
          <span className="dashboard-updated">Updated {formatTime(lastUpdated)}</span>
        )}
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh prices"
        >
          {loading ? '...' : '↻'}
        </button>
      </div>
      {error && <div className="dashboard-error">{error}</div>}
    </header>
  );
}
