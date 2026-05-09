import { useState, useCallback } from 'react';
import ScanInput from '../components/pos/ScanInput';
import CategoryTabs from '../components/pos/CategoryTabs';
import ProductGrid from '../components/pos/ProductGrid';
import CartPanel from '../components/pos/CartPanel';
import CheckoutModal from '../components/pos/CheckoutModal';
import ReceiptPreview from '../components/pos/ReceiptPreview';
import { useProductStore } from '../stores/useProductStore';
import { useTransactionStore } from '../stores/useTransactionStore';
import { useUIStore } from '../stores/useUIStore';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import type { Transaction } from '../types/transaction';
import Toast from '../components/ui/Toast';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

export default function POSPage() {
  const { products, categories, updateStock } = useProductStore();
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);
  const addToast = useUIStore((s) => s.addToast);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const items = useCartStore((s) => s.items);

  const handleSearchBarcode = useCallback(
    (barcode: string) => {
      const product = products.find((p) => p.barcode === barcode && p.isActive);
      if (product) {
        if (product.stock <= 0) {
          addToast('error', `${product.name} 已售罄`);
          return;
        }
        useCartStore.getState().addItem(product, 1);
        addToast('success', `已添加 ${product.name}`);
      } else {
        addToast('error', `未找到条码: ${barcode}`);
      }
    },
    [products, addToast],
  );

  useBarcodeScanner(handleSearchBarcode);

  const handleAddProduct = useCallback(
    (product: { id: string; name: string; price: number; stock: number }) => {
      if (product.stock <= 0) {
        addToast('error', `${product.name} 已售罄`);
        return;
      }
      const fullProduct = products.find((p) => p.id === product.id);
      if (fullProduct) {
        useCartStore.getState().addItem(fullProduct, 1);
      }
    },
    [products, addToast],
  );

  const handleScan = useCallback(
    (barcode: string) => handleSearchBarcode(barcode),
    [handleSearchBarcode],
  );

  const handleCompleteTransaction = useCallback(
    async (data: Omit<Transaction, 'id' | 'receiptNumber' | 'createdAt'>) => {
      for (const item of data.items) {
        await updateStock(item.productId, -item.quantity);
      }
      const transaction = await addTransaction(data);
      setLastTransaction(transaction);
      setShowReceipt(true);
      addToast('success', `交易完成 收据号: ${transaction.receiptNumber}`);
    },
    [updateStock, addTransaction, addToast],
  );

  return (
    <>
      {/* Toast container */}
      <div className="fixed top-14 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <Toast toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>

      <div className="flex gap-0 h-full -m-3 md:-m-4 lg:-m-6">
        {/* Mobile cart overlay */}
        {mobileCartOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileCartOpen(false)} />
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-2xl">
              <CartPanel onCheckout={() => { setMobileCartOpen(false); setShowCheckout(true); }} />
            </div>
          </div>
        )}

        {/* Main POS area */}
        <div className="flex-1 flex flex-col min-w-0 p-3 md:p-4 lg:p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <ScanInput onScan={handleScan} disabled={showCheckout} />
            </div>
            {/* Mobile cart button */}
            <button
              className="md:hidden relative p-2 rounded-lg bg-blue-600 text-white"
              onClick={() => setMobileCartOpen(true)}
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>

          <CategoryTabs
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={setSelectedCategoryId}
          />
          <div className="h-2" />
          <ProductGrid
            products={products}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onAddProduct={handleAddProduct}
          />
        </div>

        {/* Desktop cart panel */}
        <div className="hidden md:flex shrink-0">
          <CartPanel onCheckout={() => setShowCheckout(true)} />
        </div>
      </div>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onComplete={handleCompleteTransaction}
      />

      {lastTransaction && (
        <ReceiptPreview
          transaction={lastTransaction}
          open={showReceipt}
          onClose={() => { setShowReceipt(false); setLastTransaction(null); }}
        />
      )}
    </>
  );
}
