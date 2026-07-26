interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Switch({ checked, onChange }: Props) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors" />
      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
    </label>
  );
}

export default Switch;
