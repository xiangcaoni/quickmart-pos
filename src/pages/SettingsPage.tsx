import { useState } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useDataExport } from '../hooks/useDataExport';
import { useUIStore } from '../stores/useUIStore';
import { useProductStore } from '../stores/useProductStore';
import { useTransactionStore } from '../stores/useTransactionStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Download, Upload, Save } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const loadProducts = useProductStore((s) => s.loadProducts);
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const addToast = useUIStore((s) => s.addToast);
  const { exportAll, importAll } = useDataExport();
  const [confirmReset, setConfirmReset] = useState(false);

  const [form, setForm] = useState({
    storeName: settings?.storeName || '',
    storeAddress: settings?.storeAddress || '',
    storePhone: settings?.storePhone || '',
    currencySymbol: settings?.currencySymbol || '¥',
    receiptFooter: settings?.receiptFooter || '',
    lowStockThreshold: String(settings?.lowStockThreshold || 10),
    taxRate: String(settings?.taxRate || 0),
    taxInclusive: settings?.taxInclusive ?? true,
  });

  const handleSave = async () => {
    await updateSettings({
      storeName: form.storeName,
      storeAddress: form.storeAddress,
      storePhone: form.storePhone,
      currencySymbol: form.currencySymbol,
      receiptFooter: form.receiptFooter,
      lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
      taxRate: parseFloat(form.taxRate) || 0,
      taxInclusive: form.taxInclusive,
    });
    addToast('success', '设置已保存');
  };

  const handleExport = async () => {
    try {
      await exportAll();
      addToast('success', '数据已导出');
    } catch {
      addToast('error', '导出失败');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importAll(file);
      await Promise.all([loadProducts(), loadTransactions()]);
      addToast('success', `已导入 ${result.products} 商品, ${result.transactions} 笔交易`);
    } catch {
      addToast('error', '导入失败，请检查文件格式');
    }
    e.target.value = '';
  };

  const handleReset = async () => {
    await resetSettings();
    addToast('success', '设置已重置');
    setConfirmReset(false);
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">设置</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">管理店铺信息和应用偏好</p>
      </div>

      {/* Store info */}
      <section className="space-y-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">店铺信息</h3>
        <Input label="店铺名称" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
        <Input label="地址" value={form.storeAddress} onChange={(e) => setForm({ ...form, storeAddress: e.target.value })} />
        <Input label="电话" value={form.storePhone} onChange={(e) => setForm({ ...form, storePhone: e.target.value })} />
      </section>

      {/* Receipt */}
      <section className="space-y-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">小票设置</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input label="货币符号" value={form.currencySymbol} onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })} />
          <Input label="税率 (%)" type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
        </div>
        <Input label="小票页脚文字" value={form.receiptFooter} onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })} />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.taxInclusive}
              onChange={(e) => setForm({ ...form, taxInclusive: e.target.checked })}
              className="rounded"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">价格含税</span>
          </label>
        </div>
      </section>

      {/* Inventory */}
      <section className="space-y-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">库存设置</h3>
        <Input label="默认低库存预警数量" type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
      </section>

      {/* Save */}
      <Button onClick={handleSave} className="w-full">
        <Save size={16} /> 保存设置
      </Button>

      {/* Data management */}
      <section className="space-y-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">数据管理</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          导出备份可以保存所有商品、分类和交易记录。导入会替换当前数据。
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download size={16} /> 导出数据
          </Button>
          <label className="inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm px-4 py-2 h-9 transition-colors bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            <Upload size={16} /> 导入数据
          </label>
          <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
            重置设置
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={handleReset}
        title="重置设置"
        message="确定要重置所有设置为默认值吗？"
        confirmLabel="重置"
        variant="danger"
      />
    </div>
  );
}
