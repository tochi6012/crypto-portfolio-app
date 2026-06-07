import type { Holding, PricesMap } from '../types';
import { HoldingRow } from './HoldingRow';

type HoldingListProps = {
  holdings: Holding[];
  prices: PricesMap;
  onEdit: (holding: Holding) => void;
  onDelete: (id: string) => void;
};

export function HoldingList({ holdings, prices, onEdit, onDelete }: HoldingListProps) {
  if (holdings.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🪙</div>
        <p className="empty-title">No bags yet, anon</p>
        <p className="empty-subtitle">Tap + Add coin to start tracking</p>
      </div>
    );
  }

  const sorted = [...holdings].sort((a, b) => {
    const valueA = (prices[a.coinId]?.usd ?? 0) * a.amount;
    const valueB = (prices[b.coinId]?.usd ?? 0) * b.amount;
    return valueB - valueA;
  });

  return (
    <div className="holding-list">
      {sorted.map((holding) => (
        <HoldingRow
          key={holding.id}
          holding={holding}
          price={prices[holding.coinId]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
