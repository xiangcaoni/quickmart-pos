import clsx from 'clsx';

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

export default function Badge({ variant = 'default', children }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300': variant === 'default',
          'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400': variant === 'success',
          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400': variant === 'warning',
          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400': variant === 'danger',
        },
      )}
    >
      {children}
    </span>
  );
}
