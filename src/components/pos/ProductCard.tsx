import type { Product } from '../../types/product';
import { formatCurrency } from '../../lib/format';
import clsx from 'clsx';

interface Props {
  product: Product;
  onClick: () => void;
  isLowStock?: boolean;
}

export default function ProductCard({ product, onClick, isLowStock }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={product.stock <= 0}
      className={clsx(
        'flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center w-full',
        product.stock > 0
          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 active:scale-[0.98]'
          : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-50 cursor-not-allowed',
      )}
    >
      <div className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-1 w-full">
        {product.name}
      </div>
      <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {formatCurrency(product.price)}
      </div>
      <div className="flex items-center gap-1.5 text-[10px]">
        {product.stock <= 0 ? (
          <span className="text-red-500 font-medium">已售罄</span>
        ) : isLowStock ? (
          <span className="text-yellow-500 font-medium">库存 {product.stock}</span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">库存 {product.stock}</span>
        )}
      </div>
    </button>
  );
}
