import { useSettingsStore } from '../../stores/useSettingsStore';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const settings = useSettingsStore((s) => s.settings);
  const theme = useSettingsStore((s) => s.settings?.theme ?? 'system');
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-12 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-3 md:px-4 shrink-0">
      <h1 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
        {settings?.storeName || 'QuickMart POS'}
      </h1>
      <div className="flex items-center gap-3">
        <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 tabular-nums hidden sm:block">
          {time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title={theme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
