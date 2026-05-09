import { openDB, type IDBPDatabase } from 'idb';
import type { Product, Category } from '../types/product';
import type { Transaction } from '../types/transaction';
import type { Settings } from '../types/settings';
import { DB_NAME, DB_VERSION } from '../constants';

export interface POSDB {
  products: {
    key: string;
    value: Product;
    indexes: {
      'by-barcode': string;
      'by-category': string;
      'by-name': string;
    };
  };
  categories: {
    key: string;
    value: Category;
    indexes: { 'by-name': string };
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { 'by-date': string };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

let dbPromise: Promise<IDBPDatabase<POSDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<POSDB>> {
  if (!dbPromise) {
    dbPromise = openDB<POSDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const prodStore = db.createObjectStore('products', { keyPath: 'id' });
          prodStore.createIndex('by-barcode', 'barcode', { unique: true });
          prodStore.createIndex('by-category', 'categoryId', { unique: false });
          prodStore.createIndex('by-name', 'name', { unique: false });

          const catStore = db.createObjectStore('categories', { keyPath: 'id' });
          catStore.createIndex('by-name', 'name', { unique: true });

          const txnStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txnStore.createIndex('by-date', 'createdAt', { unique: false });

          db.createObjectStore('settings', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}
