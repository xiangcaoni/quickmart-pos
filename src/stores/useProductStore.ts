import { create } from 'zustand';
import { getDB } from '../db/db';
import type { Product, Category } from '../types/product';

interface ProductStore {
  products: Product[];
  categories: Category[];
  loading: boolean;
  loadProducts: () => Promise<void>;
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateStock: (id: string, delta: number) => Promise<void>;
  addCategory: (data: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getByBarcode: (barcode: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  loading: true,

  loadProducts: async () => {
    const db = await getDB();
    const products = await db.getAll('products');
    const categories = await db.getAll('categories');
    set({ products, categories, loading: false });
  },

  addProduct: async (data) => {
    const db = await getDB();
    const now = new Date().toISOString();
    const product: Product = { ...data, id: crypto.randomUUID(), createdAt: now, updatedAt: now };
    await db.add('products', product);
    set((s) => ({ products: [...s.products, product] }));
    return product;
  },

  updateProduct: async (id, data) => {
    const db = await getDB();
    const current = get().products.find((p) => p.id === id);
    if (!current) return;
    const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
    await db.put('products', updated);
    set((s) => ({ products: s.products.map((p) => (p.id === id ? updated : p)) }));
  },

  deleteProduct: async (id) => {
    const db = await getDB();
    await db.delete('products', id);
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
  },

  updateStock: async (id, delta) => {
    const db = await getDB();
    const current = get().products.find((p) => p.id === id);
    if (!current) return;
    const updated = {
      ...current,
      stock: current.stock + delta,
      updatedAt: new Date().toISOString(),
    };
    await db.put('products', updated);
    set((s) => ({ products: s.products.map((p) => (p.id === id ? updated : p)) }));
  },

  addCategory: async (data) => {
    const db = await getDB();
    const category: Category = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    await db.add('categories', category);
    set((s) => ({ categories: [...s.categories, category] }));
    return category;
  },

  updateCategory: async (id, data) => {
    const db = await getDB();
    const current = get().categories.find((c) => c.id === id);
    if (!current) return;
    const updated = { ...current, ...data };
    await db.put('categories', updated);
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? updated : c)) }));
  },

  deleteCategory: async (id) => {
    const db = await getDB();
    await db.delete('categories', id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },

  getByBarcode: (barcode) => {
    return get().products.find((p) => p.barcode === barcode && p.isActive);
  },
}));
