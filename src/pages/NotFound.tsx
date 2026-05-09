import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600">404</h1>
      <p className="text-gray-500 dark:text-gray-400">页面不存在</p>
      <Link to="/pos">
        <Button variant="secondary" size="sm">
          <Home size={16} /> 返回收银台
        </Button>
      </Link>
    </div>
  );
}
