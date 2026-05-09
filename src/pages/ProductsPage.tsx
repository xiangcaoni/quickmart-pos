import { useState, useMemo } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { formatCurrency, formatQuantity } from '../lib/format';
import { Search, Plus, Edit3, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProductFormModal from '../components/products/ProductFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { Product } from '../types/product';

export default function ProductsPage() {
  const { products, categories, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [filterLowStock, setFilterLowStock] = useState(false);

  const filtered = useMemo(() => {
    let result = products;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.barcode.includes(q));
    }
    if (filterLowStock) {
      result = result.filter((p) => p.stock <= p.lowStockThreshold);
    }
    return result;
  }, [products, search, filterLowStock]);

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || '未分类';

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">商品管理</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            共 {products.length} 个商品
            {lowStockCount > 0 && (
              <span className="text-yellow-500 ml-2">{lowStockCount} 个库存不足</span>
            )}
            {outOfStockCount > 0 && (
              <span className="text-red-500 ml-2">{outOfStockCount} 个已售罄</span>
            )}
          </p>
        </div>
        <Button
          onClick={() => { setEditingProduct(null); setShowForm(true); }}
          size="sm"
        >
          <Plus size={16} /> 添加商品
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索商品名称或条码..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <Button
          variant={filterLowStock ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilterLowStock(!filterLowStock)}
        >
          低库存
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">条码</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">名称</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">售价</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">进价</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">库存</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">分类</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{product.barcode || '—'}</td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
                      {!product.isActive && <Badge variant="default">已下架</Badge>}
                      {product.stock > 0 && product.stock <= product.lowStockThreshold && <Badge variant="warning">库存不足</Badge>}
                      {product.stock <= 0 && <Badge variant="danger">售罄</Badge>}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums font-medium text-blue-600 dark:text-blue-400">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                    {product.cost > 0 ? formatCurrency(product.cost) : '—'}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-gray-900 dark:text-gray-100">
                    {formatQuantity(product.stock, product.unit)}
                  </td>
                  <td className="py-2.5 px-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {getCategoryName(product.categoryId)}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => { setEditingProduct(product); setShowForm(true); }}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
                        title="编辑"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-500"
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    {products.length === 0 ? '暂无商品，点击上方按钮添加' : '无匹配商品'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null); }}
        product={editingProduct}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
        title="删除商品"
        message={`确定要删除 "${deleteTarget?.name}" 吗？此操作不可恢复。`}
        confirmLabel="删除"
        variant="danger"
      />
    </div>
  );
}
