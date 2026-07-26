import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { MenuItem } from '@renderer/types/menu';
import { updateItemAvailability } from '@renderer/global/services/menuService';
import { formatRupees } from '@renderer/global/utils/formatRupees';
import { useAdminSettingsStore } from '@renderer/global/store/useAdminSettingsStore';
import { getPriceForPortion } from '@renderer/global/utils/getPriceForPortion';

interface Props {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
}

function MenuItemCard({ item, onEdit, onDelete }: Props) {
  const settings = useAdminSettingsStore((state) => state.settings);

  async function handleToggle(): Promise<void> {
    try {
      await updateItemAvailability(item.id, !item.available);
      toast.success(
        item.available ? `${item.name} marked unavailable` : `${item.name} marked available`,
      );
    } catch (error) {
      console.log(error);
      toast.error('Failed to update availability');
    }
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        item.available ? 'border-border bg-white' : 'border-border bg-surface opacity-60'
      }`}>
      <div className="w-14 h-14 rounded-md bg-surface-alt overflow-hidden flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-disabled text-xs">
            No image
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-3 h-3 border flex items-center justify-center flex-shrink-0 ${
              item.item_type === 'Veg' ? 'border-success' : 'border-error'
            }`}>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                item.item_type === 'Veg' ? 'bg-success' : 'bg-error'
              }`}
            />
          </span>
          <p className="text-sm font-medium truncate">{item.name}</p>
          {item.bestSeller && (
            <span className="text-[10px] bg-primary-light text-primary px-1.5 py-0.5 rounded-full flex-shrink-0">
              Bestseller
            </span>
          )}
        </div>

        {settings && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1">
              <span className="text-text-secondary">Delivery</span>
              <span className="font-semibold text-text">
                {formatRupees(getPriceForPortion(item, 'full', 'delivery', settings))}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1">
              <span className="text-text-secondary">Takeaway</span>
              <span className="font-semibold text-text">
                {formatRupees(getPriceForPortion(item, 'full', 'takeaway', settings))}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button onClick={onEdit} className="text-text-secondary cursor-pointer">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="text-text-secondary cursor-pointer">
          <Trash2 size={16} />
        </button>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={item.available}
            onChange={handleToggle}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors" />
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
        </label>
      </div>
    </div>
  );
}

export default MenuItemCard;
