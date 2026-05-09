import { useState, useMemo } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useCartStore } from '../../stores/useCartStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatCurrency } from '../../lib/format';
import { calcCartSubtotal, calcCartTax, calcCartTotal } from '../../lib/calc';
import type { PaymentMethod, Transaction, TransactionItem } from '../../types/transaction';
import { PAYMENT_METHODS } from '../../constants';
import clsx from 'clsx';

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete: (data: Omit<Transaction, 'id' | 'receiptNumber' | 'createdAt'>) => void;
}

export default function CheckoutModal({ open, onClose, onComplete }: Props) {
  const { items, clearCart } = useCartStore();
  const settings = useSettingsStore((s) => s.settings);
  const taxRate = settings?.taxRate ?? 0;

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountPaid, setAmountPaid] = useState('');

  const subtotal = calcCartSubtotal(items);
  const tax = calcCartTax(subtotal, taxRate);
  const total = calcCartTotal(items, taxRate);

  const paidCents = useMemo(() => {
    const parsed = parseFloat(amountPaid);
    return isNaN(parsed) ? 0 : Math.round(parsed * 100);
  }, [amountPaid]);

  const change = paymentMethod === 'cash' ? Math.max(0, paidCents - total) : 0;
  const canComplete = paymentMethod === 'cash' ? paidCents >= total : true;

  const handleComplete = () => {
    const transactionItems: TransactionItem[] = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      barcode: item.product.barcode,
      quantity: item.quantity,
      unit: item.product.unit,
      unitPrice: item.product.price,
      subtotal: item.product.price * item.quantity,
    }));

    const discountAmount = 0;

    onComplete({
      items: transactionItems,
      subtotal,
      discount: discountAmount,
      total: total - discountAmount,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? paidCents : total,
      change: paymentMethod === 'cash' ? change : 0,
    });

    clearCart();
    setAmountPaid('');
    setPaymentMethod('cash');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="结账" size="md">
      <div className="space-y-4">
        {/* Items summary */}
        <div className="space-y-1 max-h-32 overflow-auto scrollbar-thin">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                {item.product.name} x{item.quantity}
              </span>
              <span className="text-gray-900 dark:text-gray-100 tabular-nums shrink-0">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t dark:border-gray-700 pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">小计</span>
            <span className="tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(subtotal)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">税费 ({taxRate}%)</span>
              <span className="tabular-nums text-gray-900 dark:text-gray-100">{formatCurrency(tax)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold">
            <span>合计</span>
            <span className="tabular-nums text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">付款方式</p>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => { setPaymentMethod(method.id); setAmountPaid(''); }}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
                  paymentMethod === method.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600',
                )}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cash payment */}
        {paymentMethod === 'cash' && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              收款金额
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                {settings?.currencySymbol || '¥'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full h-10 pl-7 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            {paidCents > 0 && paidCents >= total && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1 tabular-nums">
                找零: {formatCurrency(change)}
              </p>
            )}
            {paidCents > 0 && paidCents < total && (
              <p className="text-sm text-red-500 mt-1">
                尚缺: {formatCurrency(total - paidCents)}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button onClick={handleComplete} disabled={!canComplete} className="flex-1">
            确认收款 ({formatCurrency(total)})
          </Button>
        </div>
      </div>
    </Modal>
  );
}
