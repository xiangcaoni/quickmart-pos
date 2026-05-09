import { create } from 'zustand';
import { getDB } from '../db/db';
import type { Settings, ThemeMode } from '../types/settings';
import { THEME_STORAGE_KEY } from '../constants';

const defaultSettings: Settings = {
  id: 'app-settings',
  storeName: 'QuickMart 超市',
  storeAddress: '',
  storePhone: '',
  currency: 'CNY',
  currencySymbol: '¥',
  receiptFooter: '感谢您的惠顾！',
  lowStockThreshold: 10,
  defaultCategoryId: '',
  theme: 'system',
  taxRate: 0,
  taxInclusive: true,
  updatedAt: new Date().toISOString(),
};

interface SettingsStore {
  settings: Settings | null;
  loading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  toggleTheme: () => void;
  initTheme: () => void;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,
  loading: true,

  loadSettings: async () => {
    const db = await getDB();
    let settings = await db.get('settings', 'app-settings');
    if (!settings) {
      settings = defaultSettings;
      await db.put('settings', settings);
    }
    set({ settings, loading: false });
  },

  updateSettings: async (updates) => {
    const db = await getDB();
    const current = get().settings || defaultSettings;
    const updated: Settings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await db.put('settings', updated);
    set({ settings: updated });
  },

  initTheme: () => {
    const s = get().settings;
    const theme: ThemeMode = s?.theme || 'system';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  toggleTheme: () => {
    const s = get().settings;
    if (!s) return;
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
      get().updateSettings({ theme: 'light' });
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      get().updateSettings({ theme: 'dark' });
    }
  },

  resetSettings: async () => {
    const db = await getDB();
    await db.put('settings', defaultSettings);
    set({ settings: defaultSettings });
  },
}));
