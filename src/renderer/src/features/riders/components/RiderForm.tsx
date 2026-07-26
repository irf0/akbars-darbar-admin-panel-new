import { useState } from 'react';
import { toast } from 'sonner';
import { Rider } from '@renderer/types/rider';
import { createRider, updateRider } from '@renderer/global/services/riderService';

interface Props {
  rider: Rider | null;
  onClose: () => void;
}

function RiderForm({ rider, onClose }: Props) {
  const isEditMode = rider !== null;

  const [name, setName] = useState(rider?.name ?? '');
  const [phone, setPhone] = useState(rider?.phone ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave(): Promise<void> {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!phone.trim()) {
      toast.error('Phone is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        active: rider?.active ?? true,
      };

      if (isEditMode) {
        await updateRider(rider.id, payload);
        toast.success(`${name} updated`);
      } else {
        await createRider(payload);
        toast.success(`${name} added`);
      }

      onClose();
    } catch (error) {
      console.log('Failed to save rider', error);
      toast.error('Failed to save rider');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-[380px] h-full bg-white flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-sm font-medium">{isEditMode ? 'Edit rider' : 'Add rider'}</p>
          <button onClick={onClose} className="text-text-secondary text-sm cursor-pointer">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">
              Phone <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Add rider'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RiderForm;
