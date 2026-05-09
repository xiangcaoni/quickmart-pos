import { create } from 'zustand';
import type { ToastData } from '../components/ui/Toast';

interface UIStore {
  toasts: ToastData[];
  addToast: (type: ToastData['type'], message: string) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],

  addToast: (type, message) => {
    const id = String(++toastId);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
  },

  removeToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
