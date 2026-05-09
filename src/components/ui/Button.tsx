import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', children, className, ...props }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800': variant === 'primary',
          'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': variant === 'danger',
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700': variant === 'ghost',
        },
        {
          'text-xs px-2 py-1 h-7': size === 'sm',
          'text-sm px-4 py-2 h-9': size === 'md',
          'text-base px-6 py-3 h-12': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
