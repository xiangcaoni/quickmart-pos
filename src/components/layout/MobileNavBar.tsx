import { NavLink } from 'react-router-dom';
import { ScanBarcode, Package, Receipt, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { to: '/pos', icon: ScanBarcode, label: '收银' },
  { to: '/products', icon: Package, label: '商品' },
  { to: '/transactions', icon: Receipt, label: '历史' },
  { to: '/reports', icon: BarChart3, label: '报表' },
  { to: '/settings', icon: Settings, label: '设置' },
];

export default function MobileNavBar() {
  return (
    <div className="flex bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-0.5 py-1.5 text-[10px] ${
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
