import { create } from 'zustand';
import { getDB } from '../db/db';
import type { Transaction } from '../types/transaction';

interface TransactionStore {
  transactions: Transaction[];
  loading: boolean;
  loadTransactions: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, 'id' | 'receiptNumber' | 'createdAt'>) => Promise<Transaction>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  loading: true,

  loadTransactions: async () => {
    const db = await getDB();
    const transactions = await db.getAll('transactions');
    transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    set({ transactions, loading: false });
  },

  addTransaction: async (data) => {
    const db = await getDB();
    const existing = get().transactions;
    const maxNumber = existing.reduce((max, t) => Math.max(max, t.receiptNumber), 0);
    const transaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
      receiptNumber: maxNumber + 1,
      createdAt: new Date().toISOString(),
    };
    await db.add('transactions', transaction);
    set((s) => ({ transactions: [transaction, ...s.transactions] }));
    return transaction;
  },
}));
