import clsx from 'clsx';
import type { Category } from '../../types/product';

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
          selectedId === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600',
        )}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={clsx(
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            selectedId === cat.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600',
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
