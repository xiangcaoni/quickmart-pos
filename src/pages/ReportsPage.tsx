import { useMemo, useState } from 'react';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useProductStore } from '../stores/useProductStore';
import { formatCurrency } from '../lib/format';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Percent } from 'lucide-react';

type Period = 'today' | 'week' | 'month';

interface DateRange {
  from: Date;
  to: Date;
}

interface SummaryStats {
  totalSales: number;
  transactionCount: number;
  avgTransaction: number;
  grossProfit: number;
  itemsSold: number;
  cashCount: number;
  cardCount: number;
  mobilePayCount: number;
}

export default function ReportsPage() {
  const transactions = useTransactionStore((s) => s.transactions);
  const products = useProductStore((s) => s.products);
  const [period, setPeriod] = useState<Period>('today');

  const range: DateRange = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === 'today') {
      return { from: today, to: new Date(today.getTime() + 86400000) };
    } else if (period === 'week') {
      const weekAgo = new Date(today.getTime() - 6 * 86400000);
      return { from: weekAgo, to: new Date(today.getTime() + 86400000) };
    } else {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: monthStart, to: new Date(today.getTime() + 86400000) };
    }
  }, [period]);

  const stats: SummaryStats = useMemo(() => {
    const filtered = transactions.filter((tx) => {
      const d = new Date(tx.createdAt);
      return d >= range.from && d < range.to;
    });

    let totalSales = 0;
    let grossProfit = 0;
    let itemsSold = 0;
    let cashCount = 0;
    let cardCount = 0;
    let mobilePayCount = 0;

    for (const tx of filtered) {
      totalSales += tx.total;
      itemsSold += tx.items.reduce((s, i) => s + i.quantity, 0);
      for (const item of tx.items) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          grossProfit += (item.unitPrice - product.cost) * item.quantity;
        }
      }
      if (tx.paymentMethod === 'cash') cashCount++;
      else if (tx.paymentMethod === 'card') cardCount++;
      else if (tx.paymentMethod === 'mobile_pay') mobilePayCount++;
    }

    const transactionCount = filtered.length;
    const avgTransaction = transactionCount > 0 ? Math.round(totalSales / transactionCount) : 0;

    return { totalSales, transactionCount, avgTransaction, grossProfit, itemsSold, cashCount, cardCount, mobilePayCount };
  }, [transactions, range, products]);

  // Daily sales for chart
  const chartData = useMemo(() => {
    if (period === 'today') return [];
    const days: { label: string; amount: number }[] = [];
    const d = new Date(range.from);
    while (d < range.to) {
      const dayEnd = new Date(d.getTime() + 86400000);
      const dayTx = transactions.filter((tx) => {
        const t = new Date(tx.createdAt);
        return t >= d && t < dayEnd;
      });
      const amount = dayTx.reduce((s, tx) => s + tx.total, 0) / 100;
      days.push({
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        amount,
      });
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [transactions, range, period]);

  const cards = [
    { icon: DollarSign, label: '总销售额', value: formatCurrency(stats.totalSales), color: 'text-blue-600 dark:text-blue-400' },
    { icon: ShoppingBag, label: '交易笔数', value: String(stats.transactionCount), color: 'text-green-600 dark:text-green-400' },
    { icon: TrendingUp, label: '客单价', value: stats.transactionCount > 0 ? formatCurrency(stats.avgTransaction) : '—', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Percent, label: '毛利', value: formatCurrency(stats.grossProfit), color: 'text-orange-600 dark:text-orange-400' },
    { icon: BarChart3, label: '销售数量', value: String(stats.itemsSold), color: 'text-cyan-600 dark:text-cyan-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">销售报表</h2>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          {[
            { id: 'today' as const, label: '今日' },
            { id: 'week' as const, label: '本周' },
            { id: 'month' as const, label: '本月' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <card.icon size={20} className={card.color} />
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
              {card.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Payment breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">付款方式分布</h3>
          <div className="space-y-2">
            {[
              { label: '现金', count: stats.cashCount, color: 'bg-blue-500' },
              { label: '银行卡', count: stats.cardCount, color: 'bg-green-500' },
              { label: '移动支付', count: stats.mobilePayCount, color: 'bg-purple-500' },
            ].map((item) => {
              const total = stats.transactionCount || 1;
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-16">{item.label}</span>
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-12 text-right tabular-nums">{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">每日销售额</h3>
            <div className="flex items-end gap-1 h-40">
              {chartData.map((d) => {
                const maxAmount = Math.max(...chartData.map((c) => c.amount), 1);
                const heightPct = (d.amount / maxAmount) * 100;
                return (
                  <div key={d.label} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      {d.amount > 0 ? `¥${d.amount.toFixed(0)}` : ''}
                    </span>
                    <div className="w-full bg-blue-500/20 dark:bg-blue-500/30 rounded-t" style={{ height: `${Math.max(heightPct, 2)}%` }}>
                      <div className="w-full h-full bg-blue-500 rounded-t" style={{ height: `${heightPct}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
