import { useState } from 'react';
import { rejectionReasons } from '@renderer/types/order';

interface Props {
  orderNumber: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

function RejectOrderModal({ orderNumber, onCancel, onConfirm }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>(rejectionReasons[0]);
  const [customReason, setCustomReason] = useState('');

  const isOther = selectedReason === 'Other';
  const canConfirm = isOther ? customReason.trim().length > 0 : true;

  function handleConfirm(): void {
    const finalReason = isOther ? customReason.trim() : selectedReason;
    onConfirm(finalReason);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[400px] bg-white rounded-xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-base font-medium">Reject order #{orderNumber}?</p>
          <p className="text-sm text-text-secondary mt-1">
            {"This will cancel the order and notify the customer. This can't be undone."}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-text-secondary">Reason</label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-0.7 focus:ring-primary cursor-pointer">
            {rejectionReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>

          {isOther && (
            <input
              type="text"
              placeholder="Enter reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="border border-border rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              autoFocus
            />
          )}
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-md border border-border text-text-secondary text-sm font-medium cursor-pointer">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 py-2.5 rounded-md bg-error text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
            Reject order
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectOrderModal;
