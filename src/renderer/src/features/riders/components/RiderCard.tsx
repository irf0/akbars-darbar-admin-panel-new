import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { Rider } from '@renderer/types/rider';
import { updateRider } from '@renderer/global/services/riderService';
import Switch from '@renderer/global/components/Switch';

interface Props {
  rider: Rider;
  onEdit: () => void;
  onDelete: () => void;
}

function RiderCard({ rider, onEdit, onDelete }: Props) {
  async function handleToggle(checked: boolean): Promise<void> {
    try {
      await updateRider(rider.id, { isAvailable: checked });
      toast.success(checked ? `${rider.name} activated` : `${rider.name} deactivated`);
    } catch (error) {
      console.log('Failed to update rider', error);
      toast.error('Failed to update rider');
    }
  }

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        rider.isAvailable ? 'border-border bg-white' : 'border-border bg-surface opacity-60'
      }`}>
      <div>
        <p className="text-sm font-medium">{rider.name}</p>
        <p className="text-xs text-text-secondary mt-1">{rider.phone}</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onEdit} className="text-text-secondary cursor-pointer">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="text-text-secondary cursor-pointer">
          <Trash2 size={16} />
        </button>
        <Switch checked={rider.isAvailable} onChange={handleToggle} />
      </div>
    </div>
  );
}

export default RiderCard;
