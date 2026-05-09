import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useProductStore } from '../../stores/useProductStore';
import type { Product, ProductUnit } from '../../types/product';
import { PRODUCT_UNITS } from '../../constants';
import { useUIStore } from '../../stores/useUIStore';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

const emptyForm = {
  barcode: '',
  name: '',
  price: '',
  cost: '',
  stock: '',
  unit: 'pcs' as ProductUnit,
  categoryId: '',
  isActive: true,
  lowStockThreshold: '10',
};

export default function ProductFormModal({ open, onClose, product }: Props) {
  const { addProduct, updateProduct, categories, addCategory, products } = useProductStore();
  const addToast = useUIStore((s) => s.addToast);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState('');
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        barcode: product.barcode,
        name: product.name,
        price: String(product.price / 100),
        cost: String(product.cost / 100),
        stock: String(product.stock),
        unit: product.unit,
        categoryId: product.categoryId,
        isActive: product.isActive,
        lowStockThreshold: String(product.lowStockThreshold),
      });
    } else {
      setForm(emptyForm);
    }
  }, [product, open]);

  const handleSubmit = async () => {
    const price = Math.round(parseFloat(form.price) * 100);
    const cost = Math.round(parseFloat(form.cost) * 100);
    const stock = parseFloat(form.stock);
    const lowStockThreshold = parseInt(form.lowStockThreshold) || 10;

    if (!form.name.trim()) { addToast('error', '请输入商品名称'); return; }
    if (isNaN(price) || price <= 0) { addToast('error', '请输入有效价格'); return; }

    const existingBarcode = products.find(
      (p) => p.barcode === form.barcode && p.barcode !== '' && p.id !== product?.id,
    );
    if (form.barcode && existingBarcode) {
      addToast('error', '条码已存在');
      return;
    }

    let categoryId = form.categoryId;
    if (!categoryId && categories.length > 0) {
      categoryId = categories[0].id;
    } else if (!categoryId && newCategory.trim()) {
      const cat = await addCategory({ name: newCategory.trim(), sortOrder: categories.length });
      categoryId = cat.id;
      setNewCategory('');
    }

    const data = {
      barcode: form.barcode,
      name: form.name.trim(),
      price,
      cost: isNaN(cost) ? 0 : cost,
      stock,
      unit: form.unit,
      categoryId,
      isActive: form.isActive,
      lowStockThreshold,
    };

    if (isEditing && product) {
      await updateProduct(product.id, data);
      addToast('success', '商品已更新');
    } else {
      await addProduct(data);
      addToast('success', '商品已添加');
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? '编辑商品' : '添加商品'} size="lg">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="条码" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} placeholder="扫描或输入条码" />
          <Input label="商品名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="输入名称" />
          <Input label="售价 (元)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input label="进价 (元)" type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
          <Input label="库存" type="number" step="any" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <Input label="低库存预警" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">单位</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value as ProductUnit })}
              className="h-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {PRODUCT_UNITS.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">分类</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="h-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">未分类</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="rounded"
            />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">上架销售</span>
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">取消</Button>
          <Button onClick={handleSubmit} className="flex-1">{isEditing ? '保存' : '添加'}</Button>
        </div>
      </div>
    </Modal>
  );
}
