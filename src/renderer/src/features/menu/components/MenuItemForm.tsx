import { useState } from 'react';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import { MenuItem, ItemType } from '@renderer/types/menu';
import {
  updateMenuItem,
  createMenuItem,
  uploadMenuImage,
} from '@renderer/global/services/menuService';
import { useMenuStore } from '../store/useMenuStore';
import { getUniqueCategories, getUniqueSubCategories } from '../utils/getUniqueCategories';

interface Props {
  item: MenuItem | null;
  onClose: () => void;
}

function MenuItemForm({ item, onClose }: Props) {
  const isEditMode = item !== null;
  const allItems = useMenuStore((state) => state.items);

  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [category, setCategory] = useState(item?.category ?? '');
  const [subCategory, setSubCategory] = useState(item?.subCategory ?? '');
  const [itemType, setItemType] = useState<ItemType>(item?.item_type ?? 'Veg');
  const [bestSeller, setBestSeller] = useState(item?.bestSeller ?? false);
  const [showPortionName, setShowPortionName] = useState(item?.showPortionName ?? false);
  const [halfPortion, setHalfPortion] = useState(item?.halfPortion ?? '');
  const [fullPortion, setFullPortion] = useState(item?.fullPortion ?? '');
  const [halfPrice, setHalfPrice] = useState(item?.base_half_price?.toString() ?? '0');
  const [fullPrice, setFullPrice] = useState(item?.base_full_price?.toString() ?? '0');
  const [imagePreview, setImagePreview] = useState(item?.image ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const categories = getUniqueCategories(allItems);
  const subCategories = getUniqueSubCategories(allItems, category);

  const [isNewCategory, setIsNewCategory] = useState(
    category !== '' && !categories.includes(category),
  );
  const [isNewSubCategory, setIsNewSubCategory] = useState(
    subCategory !== '' && !subCategories.includes(subCategory),
  );

  function handleCategoryChange(value: string): void {
    if (value === '__new__') {
      setIsNewCategory(true);
      setCategory('');
    } else {
      setIsNewCategory(false);
      setCategory(value);
      setSubCategory('');
    }
  }

  function handleSubCategoryChange(value: string): void {
    if (value === '__new__') {
      setIsNewSubCategory(true);
      setSubCategory('');
    } else {
      setIsNewSubCategory(false);
      setSubCategory(value);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSave(): Promise<void> {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!category.trim()) {
      toast.error('Category is required');
      return;
    }

    if (!subCategory.trim()) {
      toast.error('Sub-category is required');
      return;
    }
    if (showPortionName) {
      if (!halfPortion.trim() || Number(halfPrice) <= 0) {
        toast.error('Half portion label and price are required');
        return;
      }
      if (!fullPortion.trim() || Number(fullPrice) <= 0) {
        toast.error('Full portion label and price are required');
        return;
      }
    } else {
      if (Number(fullPrice) <= 0) {
        toast.error('Price is required');
        return;
      }
    }

    setSaving(true);
    try {
      let imageUrl = item?.image ?? '';

      if (imageFile) {
        imageUrl = await uploadMenuImage(imageFile);
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        subCategory: subCategory.trim(),
        item_type: itemType,
        bestSeller,
        showPortionName,
        halfPortion: halfPortion.trim(),
        fullPortion: fullPortion.trim(),
        base_half_price: Number(halfPrice) || 0,
        base_full_price: Number(fullPrice) || 0,
        image: imageUrl,
        available: item?.available ?? true,
        isOutOfStock: item?.isOutOfStock ?? false,
        availableAt: item?.availableAt ?? '',
      };

      if (isEditMode) {
        await updateMenuItem(item.id, payload);
        toast.success(`${name} updated`);
      } else {
        await createMenuItem(payload);
        toast.success(`${name} added`);
      }

      onClose();
    } catch (error) {
      console.log('Failed to save item', error);
      toast.error('Failed to save item');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="w-[520px] h-full bg-white flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-sm font-medium">{isEditMode ? 'Edit item' : 'Add item'}</p>
          <button onClick={onClose} className="text-text-secondary text-sm cursor-pointer">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          <div>
            <label className="text-xs text-text-secondary mb-1.5 block">Image</label>
            <label className="group relative block w-full aspect-video rounded-lg border border-dashed border-border bg-surface-alt overflow-hidden cursor-pointer">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex flex-col items-center gap-1.5 text-white">
                      <Camera size={20} />
                      <span className="text-xs font-medium">Change image</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-text-secondary">
                  <Camera size={20} />
                  <span className="text-xs font-medium">Click to upload</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-text-secondary mb-1 block">Category</label>
              {isNewCategory ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="New category name"
                    autoFocus
                    className="w-full border border-border rounded-md px-3 py-2 text-sm"
                  />
                  {categories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsNewCategory(false)}
                      className="text-xs text-text-secondary px-2 cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm">
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__new__">+ Add new category</option>
                </select>
              )}
            </div>

            <div className="flex-1">
              <label className="text-xs text-text-secondary mb-1 block">Sub-category</label>
              {isNewSubCategory ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="New sub-category name"
                    autoFocus
                    className="w-full border border-border rounded-md px-3 py-2 text-sm"
                  />
                  {subCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsNewSubCategory(false)}
                      className="text-xs text-text-secondary px-2 cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>
              ) : (
                <select
                  value={subCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 text-sm">
                  <option value="" disabled>
                    Select sub-category
                  </option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="__new__">+ Add new sub-category</option>
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-secondary mb-1 block">Type</label>
            <div className="flex gap-2">
              {(['Veg', 'Non-Veg'] as ItemType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setItemType(type)}
                  className={`px-3 py-1.5 rounded-md text-sm border cursor-pointer ${
                    itemType === type
                      ? 'bg-primary text-white border-primary'
                      : 'border-border text-text-secondary'
                  }`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
            />
            Bestseller
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showPortionName}
              onChange={(e) => setShowPortionName(e.target.checked)}
            />
            Has half/full portions
          </label>

          {showPortionName ? (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-text-secondary mb-1 block">Half portion label</label>
                <input
                  type="text"
                  value={halfPortion}
                  onChange={(e) => setHalfPortion(e.target.value)}
                  placeholder="e.g. Half"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm mb-2"
                />
                <input
                  type="number"
                  value={halfPrice}
                  onChange={(e) => setHalfPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-secondary mb-1 block">Full portion label</label>
                <input
                  type="text"
                  value={fullPortion}
                  onChange={(e) => setFullPortion(e.target.value)}
                  placeholder="e.g. Full"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm mb-2"
                />
                <input
                  type="number"
                  value={fullPrice}
                  onChange={(e) => setFullPrice(e.target.value)}
                  placeholder="Price"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs text-text-secondary mb-1 block">
                Base price (before markup)
              </label>
              <input
                type="number"
                value={fullPrice}
                onChange={(e) => setFullPrice(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 rounded-md bg-primary text-white text-sm font-medium disabled:opacity-50 cursor-pointer">
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Add item'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemForm;
