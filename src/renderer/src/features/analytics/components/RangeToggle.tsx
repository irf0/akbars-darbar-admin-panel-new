type RangeOption = 'today' | 'week' | 'month' | 'all';

interface Props {
  value: RangeOption;
  onChange: (value: RangeOption) => void;
}

const options: { key: RangeOption; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

function RangeToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-surface-alt rounded-md p-1">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${
            value === option.key
              ? 'bg-white text-primary font-medium shadow-sm'
              : 'text-text-secondary'
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default RangeToggle;
