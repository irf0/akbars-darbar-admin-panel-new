import { RotateCw } from 'lucide-react';

function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      title="Reload app"
      className="p-2 rounded-md text-text-secondary hover:bg-surface cursor-pointer">
      <RotateCw size={16} strokeWidth={2} />
    </button>
  );
}

export default ReloadButton;
