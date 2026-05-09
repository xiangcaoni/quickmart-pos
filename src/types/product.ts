export type ProductUnit = 'pcs' | 'kg' | 'g' | 'l' | 'ml' | 'pack';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  color?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;        // cents
  cost: number;          // cents
  stock: number;
  unit: ProductUnit;
  categoryId: string;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}
