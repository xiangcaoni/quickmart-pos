export function formatCurrency(cents: number, currencySymbol = '¥'): string {
  const amount = cents / 100;
  return `${currencySymbol} ${amount.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatQuantity(qty: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    pcs: '个',
    kg: 'kg',
    g: 'g',
    l: 'L',
    ml: 'mL',
    pack: '包',
  };
  return `${qty} ${unitLabels[unit] || unit}`;
}
