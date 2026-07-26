interface Props {
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

function DeleteMenuItemModal({ itemName, onCancel, onConfirm, isDeleting }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[380px] bg-white rounded-xl p-5 flex flex-col gap-4">
        <div>
          <p className="text-base font-medium">
            Delete <span className="font-bold">{itemName}</span>?
          </p>
          <p className="text-sm text-text-secondary mt-1">
            {"This will permanently remove it from the menu. This can't be undone."}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-md border border-border text-text-secondary text-sm font-medium cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-md bg-error text-white text-sm font-medium cursor-pointer disabled:opacity-50">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteMenuItemModal;
