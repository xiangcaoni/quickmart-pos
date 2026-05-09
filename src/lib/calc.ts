import type { CartItem } from '../stores/useCartStore';

export function calcCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function calcCartTax(subtotal: number, taxRate: number): number {
  return Math.round(subtotal * (taxRate / 100));
}

export function calcCartTotal(items: CartItem[], taxRate: number): number {
  const subtotal = calcCartSubtotal(items);
  return subtotal + calcCartTax(subtotal, taxRate);
}

export function calcItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
