import { useEffect, useRef, useCallback } from 'react';

export function useBarcodeScanner(onScan: (barcode: string) => void) {
  const bufferRef = useRef<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      return;
    }

    clearTimeout(timeoutRef.current);

    if (e.key === 'Enter') {
      const barcode = bufferRef.current.trim();
      if (barcode.length >= 4) {
        onScanRef.current(barcode);
      }
      bufferRef.current = '';
      e.preventDefault();
      return;
    }

    if (/^[0-9]$/.test(e.key)) {
      bufferRef.current += e.key;
    } else {
      bufferRef.current = '';
    }

    timeoutRef.current = setTimeout(() => {
      bufferRef.current = '';
    }, 100);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutRef.current);
    };
  }, [handleKeyDown]);
}
