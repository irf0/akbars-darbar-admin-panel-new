import { useMenuStore } from '../store/useMenuStore';
import MenuItemCard from '../components/MenuItemCard';
import { useMenuListener } from '../hooks/useMenuListener';
import { groupByCategory } from '../utils/groupedByCategory';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { MenuItem } from '@renderer/types/menu';
import MenuItemForm from '../components/MenuItemForm';
import { deleteMenuItem } from '@renderer/global/services/menuService';
import { toast } from 'sonner';
import DeleteMenuItemModal from '../components/DeleteMenuItemModal';

function MenuScreen() {
  useMenuListener();

  const items = useMenuStore((state) => state.items);
  const isLoading = useMenuStore((state) => state.isLoading);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const grouped = groupByCategory(filteredItems);
  const hasResults = Object.keys(grouped).length > 0;

  async function handleConfirmDelete(): Promise<void> {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      await deleteMenuItem(deletingItem.id);
      toast.success(`${deletingItem.name} deleted`);
      setDeletingItem(null);
    } catch (error) {
      console.log('Failed to delete item', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
        <h1 className="text-base font-medium flex-shrink-0">Menu</h1>

        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border bg-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer flex-shrink-0">
          Add item
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading menu...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-text-secondary">No menu items yet</p>
        ) : !hasResults ? (
          <p className="text-sm text-text-secondary">No items match {searchTerm}</p>
        ) : (
          Object.entries(grouped).map(([category, subCategories]) => (
            <div key={category}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-text whitespace-nowrap">{category}</h2>
                <div className="h-px bg-border flex-1" />
              </div>

              {Object.entries(subCategories).map(([subCategory, subItems]) => (
                <div key={subCategory} className="mb-5">
                  {subCategory !== 'General' && (
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-1 h-3.5 bg-primary rounded-full" />
                      <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                        {subCategory}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    {subItems.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onEdit={() => setEditingItem(item)}
                        onDelete={() => setDeletingItem(item)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {isAdding && <MenuItemForm item={null} onClose={() => setIsAdding(false)} />}
      {editingItem && <MenuItemForm item={editingItem} onClose={() => setEditingItem(null)} />}
      {deletingItem && (
        <DeleteMenuItemModal
          itemName={deletingItem.name}
          onCancel={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default MenuScreen;
