export interface DateRange {
  from: Date;
  to: Date;
}

export interface SummaryStats {
  totalSales: number;
  transactionCount: number;
  avgTransaction: number;
  grossProfit: number;
  itemsSold: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  barcode: string;
  quantitySold: number;
  revenue: number;
}

export interface PaymentBreakdown {
  method: string;
  amount: number;
  count: number;
}
