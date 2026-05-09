import { useMemo, useState } from 'react';
import type { Product } from '../../types/product';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

interface Props {
  products: Product[];
  categories: { id: string; name: string }[];
  selectedCategoryId: string | null;
  onAddProduct: (product: Product) => void;
}

export default function ProductGrid({ products, selectedCategoryId, onAddProduct }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.isActive);
    if (selectedCategoryId) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.barcode.includes(q),
      );
    }
    return result;
  }, [products, selectedCategoryId, search]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索商品名称或条码..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">暂无商品</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 content-start scrollbar-thin">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onAddProduct(product)}
              isLowStock={product.stock > 0 && product.stock <= product.lowStockThreshold}
            />
          ))}
        </div>
      )}
    </div>
  );
}
