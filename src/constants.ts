export const DB_NAME = 'quickmart-pos';
export const DB_VERSION = 1;

export const CURRENCIES: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export const THEME_STORAGE_KEY = 'quickmart-theme';

export const PAYMENT_METHODS = [
  { id: 'cash' as const, label: '现金' },
  { id: 'card' as const, label: '银行卡' },
  { id: 'mobile_pay' as const, label: '移动支付' },
];

export const PRODUCT_UNITS = [
  { id: 'pcs' as const, label: '个' },
  { id: 'kg' as const, label: '千克' },
  { id: 'g' as const, label: '克' },
  { id: 'l' as const, label: '升' },
  { id: 'ml' as const, label: '毫升' },
  { id: 'pack' as const, label: '包/箱' },
];
