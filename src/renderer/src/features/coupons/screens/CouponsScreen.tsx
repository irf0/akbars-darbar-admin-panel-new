import { useState } from 'react';
import { toast } from 'sonner';
import { useCouponsListener } from '../hooks/useCouponsListener';
import { useCouponsStore } from '../store/useCouponsStore';
import { deleteCoupon } from '@renderer/global/services/couponService';
import CouponCard from '../components/CouponCard';
import CouponForm from '../components/CouponForm';
import { Coupon } from '@renderer/types/coupon';

function CouponsScreen() {
  useCouponsListener();

  const coupons = useCouponsStore((state) => state.coupons);
  const isLoading = useCouponsStore((state) => state.isLoading);

  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingCoupon) return;

    setIsDeleting(true);
    try {
      await deleteCoupon(deletingCoupon.id);
      toast.success(`${deletingCoupon.code} deleted`);
      setDeletingCoupon(null);
    } catch (error) {
      console.log('Failed to delete coupon', error);
      toast.error('Failed to delete coupon');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h1 className="text-base font-medium">Coupons</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
          Add coupon
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-text-secondary">No coupons yet</p>
        ) : (
          coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onEdit={() => setEditingCoupon(coupon)}
              onDelete={() => setDeletingCoupon(coupon)}
            />
          ))
        )}
      </div>

      {editingCoupon && (
        <CouponForm coupon={editingCoupon} onClose={() => setEditingCoupon(null)} />
      )}
      {isAdding && <CouponForm coupon={null} onClose={() => setIsAdding(false)} />}

      {deletingCoupon && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[380px] bg-white rounded-xl p-5 flex flex-col gap-4">
            <div>
              <p className="text-base font-medium">Delete {deletingCoupon.code}?</p>
              <p className="text-sm text-text-secondary mt-1">{"This can't be undone."}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingCoupon(null)}
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

export default CouponsScreen;
