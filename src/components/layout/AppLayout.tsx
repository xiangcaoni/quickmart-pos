import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNavBar from './MobileNavBar';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <aside className="hidden md:flex md:flex-col md:w-16 lg:w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-6 pb-16 md:pb-4">
          {children}
        </main>
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <MobileNavBar />
      </nav>
    </div>
  );
}
