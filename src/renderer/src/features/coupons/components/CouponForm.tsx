import { useState } from 'react';
import { toast } from 'sonner';
import { Coupon, CouponType } from '@renderer/types/coupon';
import { createCoupon, updateCoupon } from '@renderer/global/services/couponService';
import { useCouponsStore } from '../store/useCouponsStore';

interface Props {
  coupon: Coupon | null;
  onClose: () => void;
}

function CouponForm({ coupon, onClose }: Props) {
  const isEditMode = coupon !== null;
  const allCoupons = useCouponsStore((state) => state.coupons);

  const [code, setCode] = useState(coupon?.code ?? '');
  const [type, setType] = useState<CouponType>(coupon?.type ?? 'percentage');
  const [value, setValue] = useState(coupon?.value?.toString() ?? '');
  const [minOrderAmount, setMinOrderAmount] = useState(coupon?.minOrderAmount?.toString() ?? '0');
  const [maxDiscount, setMaxDiscount] = useState(coupon?.maxDiscount?.toString() ?? '0');
  const [saving, setSaving] = useState(false);

  async function handleSave(): Promise<void> {
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedCode) {
      toast.error('Coupon code is required');
      return;
    }

    if (Number(value) <= 0) {
      toast.error('Value is required');
      return;
    }

    const isDuplicate = allCoupons.some(
      (c) => c.code.toUpperCase() === trimmedCode && c.id !== coupon?.id,
    );
    if (isDuplicate) {
      toast.error('A coupon with this code already exists');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: trimmedCode,
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: Number(maxDiscount) || 0,
        active: coupon?.active ?? true,
      };

      if (isEditMode) {
        await updateCoupon(coupon.id, payload);
        toast.success(`${trimmedCode} updated`);
      } else {
        await createCoupon(payload);
        toast.success(`${trimmedCode} added`);
      }

      onClose();
    } catch (error) {
      console.log('Failed to save coupon', error);
      toast.error('Failed to save coupon');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-[420px] h-full bg-white flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-sm font-medium">{isEditMode ? 'Edit coupon' : 'Add coupon'}</p>
          <button onClick={onClose} className="text-text-secondary text-sm cursor-pointer">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">
              Code <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. DIWALI25"
              className="w-full border border-border rounded-md px-3 py-2 text-sm tracking-wide focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">Type</label>
            <div className="flex gap-2">
              {(['percentage', 'flat'] as CouponType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-md text-sm border cursor-pointer capitalize ${
                    type === t
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-text-secondary'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">
              Value {type === 'percentage' ? '(%)' : '(₹)'} <span className="text-error">*</span>
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">Min order amount (₹)</label>
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {type === 'percentage' && (
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Max discount (₹)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Add coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CouponForm;
