import { useState } from 'react';
import { toast } from 'sonner';
import { useRidersListener } from '../hooks/useRidersListener';
import { useRidersStore } from '../store/useRidersStore';
import { deleteRider } from '@renderer/global/services/riderService';
import RiderCard from '../components/RiderCard';
import RiderForm from '../components/RiderForm';
import { Rider } from '@renderer/types/rider';

function RidersScreen() {
  useRidersListener();

  const riders = useRidersStore((state) => state.riders);
  const isLoading = useRidersStore((state) => state.isLoading);

  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingRider, setDeletingRider] = useState<Rider | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingRider) return;

    setIsDeleting(true);
    try {
      await deleteRider(deletingRider.id);
      toast.success(`${deletingRider.name} deleted`);
      setDeletingRider(null);
    } catch (error) {
      console.log('Failed to delete rider', error);
      toast.error('Failed to delete rider');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h1 className="text-base font-medium">Riders</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
          Add rider
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading riders...</p>
        ) : riders.length === 0 ? (
          <p className="text-sm text-text-secondary">No riders yet</p>
        ) : (
          riders.map((rider) => (
            <RiderCard
              key={rider.id}
              rider={rider}
              onEdit={() => setEditingRider(rider)}
              onDelete={() => setDeletingRider(rider)}
            />
          ))
        )}
      </div>

      {editingRider && <RiderForm rider={editingRider} onClose={() => setEditingRider(null)} />}
      {isAdding && <RiderForm rider={null} onClose={() => setIsAdding(false)} />}

      {deletingRider && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[380px] bg-white rounded-xl p-5 flex flex-col gap-4">
            <div>
              <p className="text-base font-medium">Delete {deletingRider.name}?</p>
              <p className="text-sm text-text-secondary mt-1">{"This can't be undone."}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingRider(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-md border border-border text-text-secondary text-sm font-medium cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-md bg-error text-white text-sm font-medium cursor-pointer disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RidersScreen;
