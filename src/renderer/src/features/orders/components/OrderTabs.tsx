import { OrderStatus } from '@renderer/types/order';

const tabs: { key: OrderStatus; label: string }[] = [
  { key: 'placed', label: 'New' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  // { key: 'completed', label: 'Completed' },
];

interface Props {
  active: OrderStatus;
  counts: Record<OrderStatus, number>;
  onChange: (status: OrderStatus) => void;
}

function OrderTabs({ active, counts, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-gray-200 px-5">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`cursor-pointer px-3 py-2.5 text-sm border-b-2 -mb-px ${
            active === tab.key
              ? 'border-primary text-amber-700 font-medium'
              : 'border-transparent text-gray-500'
          }`}>
          {tab.label}
          {counts[tab.key] > 0 && (
            <span className="ml-1.5 text-xs text-gray-400">({counts[tab.key]})</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default OrderTabs;
