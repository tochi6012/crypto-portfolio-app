import { FormEvent, useEffect, useState } from 'react';
import type { CoinSearchResult, Holding } from '../types';
import { CoinSearch } from './CoinSearch';

type AddHoldingModalProps = {
  open: boolean;
  editing: Holding | null;
  onClose: () => void;
  onSave: (data: {
    coinId: string;
    symbol: string;
    name: string;
    image: string;
    amount: number;
  }) => void;
  onUpdate: (id: string, amount: number) => void;
};

export function AddHoldingModal({
  open,
  editing,
  onClose,
  onSave,
  onUpdate,
}: AddHoldingModalProps) {
  const [selectedCoin, setSelectedCoin] = useState<CoinSearchResult | null>(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (open) {
      if (editing) {
        setSelectedCoin({
          id: editing.coinId,
          name: editing.name,
          symbol: editing.symbol,
          thumb: editing.image,
        });
        setAmount(String(editing.amount));
      } else {
        setSelectedCoin(null);
        setAmount('');
      }
    }
  }, [open, editing]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    if (editing) {
      onUpdate(editing.id, parsed);
    } else if (selectedCoin) {
      onSave({
        coinId: selectedCoin.id,
        symbol: selectedCoin.symbol,
        name: selectedCoin.name,
        image: selectedCoin.thumb,
        amount: parsed,
      });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title" className="modal-title">
          {editing ? 'Edit holding' : 'Add coin'}
        </h2>

        <form onSubmit={handleSubmit}>
          {!editing && (
            <div className="form-group">
              <label className="label">Coin</label>
              <CoinSearch
                selected={selectedCoin}
                onSelect={setSelectedCoin}
              />
              {!selectedCoin && (
                <p className="form-hint">Search, then tap a coin from the list</p>
              )}
            </div>
          )}

          {editing && (
            <div className="editing-coin">
              <img src={editing.image} alt="" width={40} height={40} />
              <div>
                <div className="selected-coin-name">{editing.name}</div>
                <div className="selected-coin-symbol">{editing.symbol}</div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="label" htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              className="input"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
              required
              inputMode="decimal"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!editing && !selectedCoin}
            >
              {editing ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
