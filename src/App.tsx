import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import POSPage from './pages/POSPage';
import ProductsPage from './pages/ProductsPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import { useSettingsStore } from './stores/useSettingsStore';
import { useProductStore } from './stores/useProductStore';
import { useTransactionStore } from './stores/useTransactionStore';
import { useEffect } from 'react';

function App() {
  const initTheme = useSettingsStore((s) => s.initTheme);
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const loadTransactions = useTransactionStore((s) => s.loadTransactions);
  const loading = useSettingsStore((s) => s.loading);

  useEffect(() => {
    initTheme();
    Promise.all([loadSettings(), loadProducts(), loadTransactions()]);
  }, [initTheme, loadSettings, loadProducts, loadTransactions]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400 text-lg">加载中...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/pos" replace />} />
          <Route path="/pos" element={<POSPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
}

export default App;
