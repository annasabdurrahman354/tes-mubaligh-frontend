import { useEffect, useCallback, useState, useRef } from 'react';

interface RFIDConfig {
  length?: number;
  timeout?: number;
}

interface UseRFIDScanner {
  code: string;
  isReading: boolean;
  reset: () => void;
}

export const useRFIDScanner = (
  onScan: (code: string) => void,
  config: RFIDConfig = {}
): UseRFIDScanner => {
  const { length = 10, timeout = 200 } = config;
  
  const [code, setCode] = useState<string>('');
  const [isReading, setIsReading] = useState<boolean>(false);
  const codeRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const reset = useCallback(() => {
    setCode('');
    codeRef.current = '';
    setIsReading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // If we're in the timeout period after a successful scan, reset first
      if (isReading) {
        reset();
      }

      if (e.key === 'Enter') {
        if (codeRef.current.length === length) {
          onScan(codeRef.current);
          setIsReading(true);

          timeoutRef.current = setTimeout(() => {
            reset();
          }, timeout);
        } else {
          reset();
        }
      } else if (/^\d$/.test(e.key)) {
        const newCode = codeRef.current + e.key;
        // Only update if we haven't reached the maximum length
        if (newCode.length <= length) {
          codeRef.current = newCode;
          setCode(newCode);
        }
      } else {
        reset();
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [length, timeout, onScan, reset, isReading]);

  return { code, isReading, reset };
};