export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  id: 'app-settings';
  storeName: string;
  storeAddress: string;
  storePhone: string;
  currency: string;
  currencySymbol: string;
  receiptFooter: string;
  lowStockThreshold: number;
  defaultCategoryId: string;
  theme: ThemeMode;
  taxRate: number;
  taxInclusive: boolean;
  updatedAt: string;
}
