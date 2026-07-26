import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { Coupon } from '@renderer/types/coupon';
import { updateCouponActive } from '@renderer/global/services/couponService';
import { formatRupees } from '@renderer/global/utils/formatRupees';
import Switch from '@renderer/global/components/Switch';

interface Props {
  coupon: Coupon;
  onEdit: () => void;
  onDelete: () => void;
}

function CouponCard({ coupon, onEdit, onDelete }: Props) {
  async function handleToggle(checked: boolean): Promise<void> {
    try {
      await updateCouponActive(coupon.id, checked);
      toast.success(checked ? `${coupon.code} activated` : `${coupon.code} deactivated`);
    } catch (error) {
      console.log('Failed to update coupon', error);
      toast.error('Failed to update coupon');
    }
  }

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        coupon.active ? 'border-border bg-white' : 'border-border bg-surface opacity-60'
      }`}>
      <div>
        <p className="text-sm font-medium tracking-wide">{coupon.code}</p>
        <p className="text-xs text-text-secondary mt-1">
          {coupon.type === 'percentage'
            ? `${coupon.value}% off, up to ${formatRupees(coupon.maxDiscount)}`
            : `${formatRupees(coupon.value)} off`}
          {' · '}Min order {formatRupees(coupon.minOrderAmount)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onEdit} className="text-text-secondary cursor-pointer">
          <Pencil size={16} />
        </button>
        <button onClick={onDelete} className="text-text-secondary cursor-pointer">
          <Trash2 size={16} />
        </button>
        <Switch checked={coupon.active} onChange={handleToggle} />
      </div>
    </div>
  );
}

export default CouponCard;
