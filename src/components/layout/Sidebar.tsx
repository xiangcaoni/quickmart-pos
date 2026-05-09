import { NavLink } from 'react-router-dom';
import { ScanBarcode, Package, Receipt, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { to: '/pos', icon: ScanBarcode, label: '收银' },
  { to: '/products', icon: Package, label: '商品' },
  { to: '/transactions', icon: Receipt, label: '历史' },
  { to: '/reports', icon: BarChart3, label: '报表' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-1 p-2">
      <div className="flex items-center gap-2 px-3 py-3 mb-2">
        <ScanBarcode className="text-blue-600 dark:text-blue-400 shrink-0" size={24} />
        <span className="hidden lg:block text-lg font-bold text-gray-800 dark:text-gray-100">
          QuickMart
        </span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
        >
          <item.icon size={20} className="shrink-0" />
          <span className="hidden lg:block text-sm font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
