import type { Holding, PriceData } from '../types';
import { formatAmount, formatPercent, formatUsd } from '../utils/format';

type HoldingRowProps = {
  holding: Holding;
  price?: PriceData;
  onEdit: (holding: Holding) => void;
  onDelete: (id: string) => void;
};

export function HoldingRow({ holding, price, onEdit, onDelete }: HoldingRowProps) {
  const value = price ? holding.amount * price.usd : 0;
  const change = price?.usd_24h_change ?? 0;
  const isPositive = change >= 0;

  return (
    <div className="holding-row">
      <img
        src={holding.image}
        alt=""
        className="holding-icon"
        width={40}
        height={40}
      />
      <div className="holding-info">
        <div className="holding-top">
          <span className="holding-symbol">{holding.symbol}</span>
          <span className="holding-value">{formatUsd(value)}</span>
        </div>
        <div className="holding-bottom">
          <span className="holding-amount">
            {formatAmount(holding.amount)} · {price ? formatUsd(price.usd) : '—'}
          </span>
          {price && (
            <span className={`holding-change ${isPositive ? 'positive' : 'negative'}`}>
              {formatPercent(change)}
            </span>
          )}
        </div>
      </div>
      <div className="holding-actions">
        <button
          type="button"
          className="action-btn"
          onClick={() => onEdit(holding)}
          aria-label={`Edit ${holding.symbol}`}
        >
          ✎
        </button>
        <button
          type="button"
          className="action-btn action-btn-danger"
          onClick={() => onDelete(holding.id)}
          aria-label={`Delete ${holding.symbol}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
