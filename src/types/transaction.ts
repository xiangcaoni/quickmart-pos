export type PaymentMethod = 'cash' | 'card' | 'mobile_pay';

export interface TransactionItem {
  productId: string;
  productName: string;
  barcode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  receiptNumber: number;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  createdAt: string;
}
