import { forwardRef } from 'react';
import type { Transaction } from '../../types/transaction';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatCurrency, formatDateTime } from '../../lib/format';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Printer } from 'lucide-react';

interface ReceiptContentProps {
  transaction: Transaction;
}

const ReceiptContent = forwardRef<HTMLDivElement, ReceiptContentProps>(({ transaction }, ref) => {
  const settings = useSettingsStore((s) => s.settings);

  return (
    <div ref={ref} className="receipt bg-white p-4 max-w-[80mm] mx-auto text-[10px] font-mono text-black">
      <h2 className="text-center font-bold text-sm">{settings?.storeName || 'QuickMart'}</h2>
      {settings?.storeAddress && <p className="text-center">{settings.storeAddress}</p>}
      {settings?.storePhone && <p className="text-center">{settings.storePhone}</p>}
      <hr className="border-dashed border-gray-300 my-1" />
      <p>收据号: {String(transaction.receiptNumber).padStart(6, '0')}</p>
      <p>{formatDateTime(transaction.createdAt)}</p>
      <hr className="border-dashed border-gray-300 my-1" />
      {transaction.items.map((item) => (
        <div key={item.productId} className="flex justify-between">
          <span className="truncate mr-2">{item.productName} x{item.quantity}</span>
          <span className="tabular-nums shrink-0">{formatCurrency(item.subtotal)}</span>
        </div>
      ))}
      <hr className="border-dashed border-gray-300 my-1" />
      <div className="flex justify-between font-bold">
        <span>合计</span>
        <span className="tabular-nums">{formatCurrency(transaction.total)}</span>
      </div>
      <p>
        付款方式: {
          transaction.paymentMethod === 'cash' ? '现金' :
          transaction.paymentMethod === 'card' ? '银行卡' : '移动支付'
        }
      </p>
      {transaction.paymentMethod === 'cash' && (
        <>
          <p>已收: {formatCurrency(transaction.amountPaid)}</p>
          <p>找零: {formatCurrency(transaction.change)}</p>
        </>
      )}
      <hr className="border-dashed border-gray-300 my-1" />
      <p className="text-center italic text-[8px]">{settings?.receiptFooter || '感谢您的惠顾！'}</p>
    </div>
  );
});

ReceiptContent.displayName = 'ReceiptContent';

interface Props {
  transaction: Transaction;
  open: boolean;
  onClose: () => void;
}

export default function ReceiptPreview({ transaction, open, onClose }: Props) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>收据 #${transaction.receiptNumber}</title>
      <style>
        body { width: 80mm; margin: 0; padding: 0; font-family: monospace; font-size: 10px; }
        .receipt { padding: 10px; }
        hr { border: none; border-top: 1px dashed #ccc; margin: 4px 0; }
        @page { margin: 0; size: 80mm auto; }
      </style></head>
      <body><div class="receipt"></div></body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 200);
  };

  return (
    <Modal open={open} onClose={onClose} title="收据" size="sm">
      <ReceiptContent transaction={transaction} />
      <div className="flex gap-2 mt-4">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          关闭
        </Button>
        <Button onClick={handlePrint} className="flex-1">
          <Printer size={16} /> 打印
        </Button>
      </div>
    </Modal>
  );
}
