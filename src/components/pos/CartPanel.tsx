import { useCartStore } from '../../stores/useCartStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatCurrency } from '../../lib/format';
import { calcCartSubtotal, calcCartTax, calcCartTotal, calcItemCount } from '../../lib/calc';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';

interface Props {
  onCheckout: () => void;
}

export default function CartPanel({ onCheckout }: Props) {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const settings = useSettingsStore((s) => s.settings);
  const taxRate = settings?.taxRate ?? 0;

  const subtotal = calcCartSubtotal(items);
  const tax = calcCartTax(subtotal, taxRate);
  const total = calcCartTotal(items, taxRate);
  const itemCount = calcItemCount(items);

  if (items.length === 0) {
    return (
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-3 p-4 text-gray-400 dark:text-gray-500">
        <ShoppingCart size={48} />
        <p className="text-sm">购物车为空</p>
        <p className="text-xs">扫描条码或点击商品添加</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          购物车 ({itemCount} 件)
        </span>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
        >
          清空
        </button>
      </div>

      <div className="flex-1 overflow-auto scrollbar-thin">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatCurrency(item.product.price)} / {item.product.unit}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm tabular-nums text-gray-900 dark:text-gray-100">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="w-20 text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                {formatCurrency(item.product.price * item.quantity)}
              </p>
            </div>
            <button
              onClick={() => removeItem(item.product.id)}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-1">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>小计</span>
          <span className="tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        {taxRate > 0 && (
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>税费 ({taxRate}%)</span>
            <span className="tabular-nums">{formatCurrency(tax)}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-bold text-gray-900 dark:text-gray-100 pt-1">
          <span>合计</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
        <Button onClick={onCheckout} size="lg" className="w-full mt-2">
          结账
        </Button>
      </div>
    </div>
  );
}
