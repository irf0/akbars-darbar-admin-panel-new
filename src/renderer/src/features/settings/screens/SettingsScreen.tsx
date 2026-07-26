import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAdminSettingsStore } from '@renderer/global/store/useAdminSettingsStore';
import { updateAdminSettings } from '@renderer/global/services/adminSettingsService';
import Switch from '@renderer/global/components/Switch';
import { AdminSettings } from '@renderer/types/admin';

function SettingsScreen() {
  const settings = useAdminSettingsStore((state) => state.settings);
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  if (!form) {
    return <div className="p-5 text-sm text-text-secondary">Loading settings...</div>;
  }

  function updateField(key: keyof AdminSettings, value: string | number | boolean): void {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(): Promise<void> {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        deliveryCharge: Number(form.deliveryCharge) || 0,
        deliveryMenuHikePercentage: Number(form.deliveryMenuHikePercentage) || 0,
        deliveryDiscountPercentage: Number(form.deliveryDiscountPercentage) || 0,
        takeawayMenuHikePercentage: Number(form.takeawayMenuHikePercentage) || 0,
        takeawayDiscountPercentage: Number(form.takeawayDiscountPercentage) || 0,
        cgstRate: Number(form.cgstRate) || 0,
        sgstRate: Number(form.sgstRate) || 0,
        packingCharge: Number(form.packingCharge) || 0,
        platformFee: Number(form.platformFee) || 0,
      };
      await updateAdminSettings(payload);
      toast.success('Settings updated');
    } catch (error) {
      console.log('Failed to update settings', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h1 className="text-base font-medium">Settings</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 max-w-2xl">
          {/* Shop status */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Shop status</h2>

            <div className="flex items-center justify-between py-2.5 border-b border-border">
              <div>
                <p className="text-sm">Shop closed</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Stops accepting new orders when on
                </p>
              </div>
              <Switch
                checked={form.isShopClosed}
                onChange={(checked) => updateField('isShopClosed', checked)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <div className="flex-1">
                <label className="text-xs text-text-secondary mb-1.5 block">Opening time</label>
                <input
                  type="time"
                  value={form.openingTime}
                  onChange={(e) => updateField('openingTime', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-secondary mb-1.5 block">Closing time</label>
                <input
                  type="time"
                  value={form.closingTime}
                  onChange={(e) => updateField('closingTime', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Delivery</h2>

            <div className="flex items-center justify-between py-2.5 border-b border-border mb-4">
              <p className="text-sm">Delivery enabled</p>
              <Switch
                checked={form.deliveryEnabled}
                onChange={(checked) => updateField('deliveryEnabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Charge (₹)</label>
                <input
                  type="number"
                  value={form.deliveryCharge}
                  onChange={(e) => updateField('deliveryCharge', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Menu hike (%)</label>
                <input
                  type="number"
                  value={form.deliveryMenuHikePercentage}
                  onChange={(e) => updateField('deliveryMenuHikePercentage', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Takeaway */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Takeaway</h2>

            <div className="flex items-center justify-between py-2.5 border-b border-border mb-4">
              <p className="text-sm">Takeaway enabled</p>
              <Switch
                checked={form.takeawayEnabled}
                onChange={(checked) => updateField('takeawayEnabled', checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Menu hike (%)</label>
                <input
                  type="number"
                  value={form.takeawayMenuHikePercentage}
                  onChange={(e) => updateField('takeawayMenuHikePercentage', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              {/* <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Discount (%)</label>
                <input
                  type="number"
                  value={form.takeawayDiscountPercentage}
                  onChange={(e) => updateField('takeawayDiscountPercentage', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div> */}
            </div>
          </div>

          {/* Charges & taxes */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Charges & taxes</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">CGST rate (%)</label>
                <input
                  type="number"
                  value={form.cgstRate}
                  onChange={(e) => updateField('cgstRate', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">SGST rate (%)</label>
                <input
                  type="number"
                  value={form.sgstRate}
                  onChange={(e) => updateField('sgstRate', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">
                  Packing charge (₹)
                </label>
                <input
                  type="number"
                  value={form.packingCharge}
                  onChange={(e) => updateField('packingCharge', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Platform fee (₹)</label>
                <input
                  type="number"
                  value={form.platformFee ?? 0}
                  onChange={(e) => updateField('platformFee', e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Payments</h2>
            <div className="flex items-center justify-between">
              <p className="text-sm">Cash on delivery enabled</p>
              <Switch
                checked={form.isCODEnabled}
                onChange={(checked) => updateField('isCODEnabled', checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsScreen;
