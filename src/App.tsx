import { useMemo, useState } from 'react';
import { AddHoldingModal } from './components/AddHoldingModal';
import { Dashboard } from './components/Dashboard';
import { HoldingList } from './components/HoldingList';
import { useHoldings } from './hooks/useHoldings';
import { usePrices } from './hooks/usePrices';
import type { Holding } from './types';

export default function App() {
  const { holdings, addHolding, updateHolding, removeHolding } = useHoldings();
  const coinIds = useMemo(() => holdings.map((h) => h.coinId), [holdings]);
  const { prices, loading, error, lastUpdated, refresh } = usePrices(coinIds);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Holding | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (holding: Holding) => {
    setEditing(holding);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="app">
      <Dashboard
        holdings={holdings}
        prices={prices}
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        onRefresh={refresh}
      />

      <HoldingList
        holdings={holdings}
        prices={prices}
        onEdit={openEdit}
        onDelete={removeHolding}
      />

      <button type="button" className="fab" onClick={openAdd}>
        + Add coin
      </button>

      <AddHoldingModal
        open={modalOpen}
        editing={editing}
        onClose={closeModal}
        onSave={addHolding}
        onUpdate={updateHolding}
      />
    </div>
  );
}
