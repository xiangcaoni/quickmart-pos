import { useState, useMemo } from 'react';
import { useTransactionStore } from '../stores/useTransactionStore';
import { formatCurrency, formatDateTime } from '../lib/format';
import { Search, Eye } from 'lucide-react';
import ReceiptPreview from '../components/pos/ReceiptPreview';
import type { Transaction } from '../types/transaction';

export default function TransactionsPage() {
  const { transactions } = useTransactionStore();
  const [search, setSearch] = useState('');
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        String(t.receiptNumber).includes(q) ||
        t.items.some((item) => item.productName.toLowerCase().includes(q)),
    );
  }, [transactions, search]);

  const paymentLabels: Record<string, string> = {
    cash: '现金',
    card: '银行卡',
    mobile_pay: '移动支付',
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">交易历史</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">共 {transactions.length} 笔交易</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索收据号或商品..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">收据号</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">时间</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">商品</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">金额</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">付款方式</th>
                <th className="text-center py-3 px-4 font-medium text-gray-500 dark:text-gray-400">收据</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="py-2.5 px-4 font-mono text-xs text-gray-900 dark:text-gray-100">
                    #{String(tx.receiptNumber).padStart(6, '0')}
                  </td>
                  <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400 text-xs">
                    {formatDateTime(tx.createdAt)}
                  </td>
                  <td className="py-2.5 px-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell max-w-[200px] truncate">
                    {tx.items.map((i) => `${i.productName} x${i.quantity}`).join(', ')}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(tx.total)}
                  </td>
                  <td className="py-2.5 px-4 hidden md:table-cell">
                    <span className="text-gray-500 dark:text-gray-400">
                      {paymentLabels[tx.paymentMethod] || tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => setViewingTransaction(tx)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
                      title="查看收据"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 dark:text-gray-500">
                    {transactions.length === 0 ? '暂无交易记录' : '无匹配结果'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewingTransaction && (
        <ReceiptPreview
          transaction={viewingTransaction}
          open={!!viewingTransaction}
          onClose={() => setViewingTransaction(null)}
        />
      )}
    </div>
  );
}
