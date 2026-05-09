import { useRef, useEffect, useState } from 'react';
import { ScanBarcode } from 'lucide-react';

interface Props {
  onScan: (barcode: string) => void;
  disabled?: boolean;
}

export default function ScanInput({ onScan, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      inputRef.current?.focus();
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const barcode = value.trim();
      if (barcode.length >= 4) {
        onScan(barcode);
        setValue('');
      }
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="扫描条码或手动输入..."
        disabled={disabled}
        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    </div>
  );
}
