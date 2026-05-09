import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface Props {
  toast: ToastData;
  onRemove: (id: string) => void;
}

export default function Toast({ toast, onRemove }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };
  const Icon = icons[toast.type];

  return (
    <div
      className={clsx(
        'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg min-w-[280px] animate-slide-up',
        {
          'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800': toast.type === 'success',
          'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800': toast.type === 'error',
          'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800': toast.type === 'info',
        },
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span className="text-sm flex-1">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="shrink-0 p-0.5">
        <X size={14} />
      </button>
    </div>
  );
}
