import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { OrderDoc, Customer, Address } from '@renderer/types/order';
import { fetchCustomer, fetchAddress } from '@renderer/global/services/customerService';
import { formatMoney } from '@renderer/utils/formatMoney';
import { printKOT } from '@renderer/global/services/printService';
import { riders } from '@renderer/global/constants/riders';
import { buildMapsLink } from '@renderer/global/utils/mapsLinkGenerator';
import { assignRider } from '@renderer/global/services/orderService';

interface Props {
  order: OrderDoc;
  onClose: () => void;
}

function OrderDetail({ order, onClose }: Props) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedRider, setSelectedRider] = useState(riders[0]);

  useEffect(() => {
    let cancelled = false;

    async function loadDetails(): Promise<void> {
      setLoading(true);

      try {
        const customerData = await fetchCustomer(order?.uid);
        let addressData: Address | null = null;

        if (order.orderType === 'delivery' && order?.addressId) {
          addressData = await fetchAddress(order?.uid, order?.addressId);
        }

        if (!cancelled) {
          setCustomer(customerData);
          setAddress(addressData);
        }
      } catch (error) {
        console.log('Failed to load customer details', error);
        toast.error('Failed to load customer details');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [order.uid, order.addressId, order.orderType]);

  async function handleAssignRider(): Promise<void> {
    if (!address) {
      toast.error('Address not loaded yet');
      return;
    }

    setAssigning(true);
    try {
      const mapsLink = buildMapsLink(address);
      await assignRider(order.id, selectedRider, mapsLink);
      toast.success(`Assigned to ${selectedRider}`);
    } catch (error) {
      console.log(error);
      toast.error('Failed to assign rider');
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-[420px] h-full bg-white flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-medium">{order.orderNumber}</p>
            <p className="text-xs text-text-secondary mt-0.5">
              {order.orderType} · {order.paymentStatus.replace('_', ' ')}
            </p>
          </div>
          <button onClick={onClose} className="text-text-secondary text-sm cursor-pointer">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div className="text-sm">
            <p className="text-text-secondary text-xs mb-1">Customer</p>
            {loading ? (
              <p className="text-text-disabled">Loading...</p>
            ) : (
              <>
                <p className="font-medium">{customer?.name ?? 'Unknown'}</p>
                <p className="text-text-secondary">{customer?.phone ?? '—'}</p>
              </>
            )}
          </div>

          {order.orderType === 'delivery' && (
            <div className="text-sm">
              <p className="text-text-secondary text-xs mb-1">Delivery address</p>
              {loading ? (
                <p className="text-text-disabled">Loading...</p>
              ) : address ? (
                <>
                  <p>{address.line1}</p>
                  {address.line2 && <p>{address.line2}</p>}
                  {address.landmark && <p className="text-text-secondary">{address.landmark}</p>}
                </>
              ) : (
                <p className="text-text-secondary">Address not found</p>
              )}
            </div>
          )}

          {order.orderType === 'delivery' && (
            <div className="text-sm">
              <p className="text-text-secondary text-xs mb-1">Rider</p>

              {order.riderName ? (
                <>
                  <p className="font-medium">{order.riderName}</p>
                  {order.riderMapsLink && (
                    <a
                      href={order.riderMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary text-xs underline">
                      Open in Maps
                    </a>
                  )}
                </>
              ) : (
                <div className="flex gap-2 mt-1">
                  <select
                    value={selectedRider}
                    onChange={(e) => setSelectedRider(e.target.value)}
                    className="border border-border rounded-md px-2 py-1.5 text-sm flex-1">
                    {riders.map((rider) => (
                      <option key={rider} value={rider}>
                        {rider}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignRider}
                    disabled={assigning}
                    className="px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
                    {assigning ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              )}
            </div>
          )}

          {order.orderType === 'takeaway' && order.takeawaySlot && (
            <div className="text-sm">
              <p className="text-text-secondary text-xs mb-1">Pickup slot</p>
              <p>{order.takeawaySlot}</p>
            </div>
          )}

          {order.deliveryOtp && (
            <div className="text-sm">
              <p className="text-text-secondary text-xs mb-1">Delivery OTP</p>
              <p className="font-medium tracking-wider">{order.deliveryOtp}</p>
            </div>
          )}

          {order.cookingInstructions && (
            <div className="text-sm">
              <p className="text-text-secondary text-xs mb-1">Cooking instructions</p>
              <p>{order.cookingInstructions}</p>
            </div>
          )}

          {order.orderStatus === 'cancelled' && order.cancellationReason && (
            <div className="text-sm">
              <p className="text-text-secondary text-xs mb-1">Cancellation reason</p>
              <p className="text-error">{order.cancellationReason}</p>
            </div>
          )}

          <div>
            <p className="text-text-secondary text-xs mb-2">Items</p>
            <div className="flex flex-col gap-2">
              {order.lineItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                    <span className="text-text-secondary"> ({item.portion})</span>
                  </span>
                  <span>{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatMoney(order.bill.itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>CGST</span>
              <span>{formatMoney(order.bill.cgstAmount)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>SGST</span>
              <span>{formatMoney(order.bill.sgstAmount)}</span>
            </div>
            {order.bill.deliveryCharge > 0 && (
              <div className="flex justify-between text-text-secondary">
                <span>Delivery charge</span>
                <span>{formatMoney(order.bill.deliveryCharge)}</span>
              </div>
            )}
            {order.bill.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatMoney(order.bill.discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium pt-2 border-t border-border mt-1">
              <span>Total</span>
              <span>{formatMoney(order.bill.total)}</span>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-border">
          <button
            onClick={() => printKOT(order)}
            className="w-full py-2.5 rounded-md bg-primary text-white text-sm font-medium cursor-pointer">
            Reprint KOT
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
