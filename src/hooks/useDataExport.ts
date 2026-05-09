import { getDB } from '../db/db';

export function useDataExport() {
  const exportAll = async () => {
    const db = await getDB();
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products: await db.getAll('products'),
      categories: await db.getAll('categories'),
      transactions: await db.getAll('transactions'),
      settings: await db.get('settings', 'app-settings'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickmart-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return data;
  };

  const importAll = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!data.products || !data.categories || !data.transactions) {
      throw new Error('Invalid backup file format');
    }

    const db = await getDB();
    const tx = db.transaction(['products', 'categories', 'transactions', 'settings'], 'readwrite');

    await tx.objectStore('products').clear();
    await tx.objectStore('categories').clear();
    await tx.objectStore('transactions').clear();

    for (const p of data.products) await tx.objectStore('products').put(p);
    for (const c of data.categories) await tx.objectStore('categories').put(c);
    for (const t of data.transactions) await tx.objectStore('transactions').put(t);
    if (data.settings) await tx.objectStore('settings').put(data.settings);

    await tx.done;

    return {
      products: data.products.length,
      categories: data.categories.length,
      transactions: data.transactions.length,
    };
  };

  return { exportAll, importAll };
}
