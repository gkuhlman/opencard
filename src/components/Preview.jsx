import { useMemo, useRef, useEffect, useState } from 'react';
import { generatePage } from '../engine/generate';

export default function Preview({ config }) {
  const [html, setHtml] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        setHtml(generatePage(config));
      } catch {
        // Keep last valid HTML on error
      }
    }, 80);
    return () => clearTimeout(timerRef.current);
  }, [config]);

  // Generate initial HTML synchronously
  const initialHtml = useMemo(() => {
    try {
      return generatePage(config);
    } catch {
      return '';
    }
  }, []); // only on mount

  return (
    <iframe
      srcDoc={html || initialHtml}
      className="w-full h-full border-0"
      title="Scorecard Preview"
      sandbox="allow-same-origin"
    />
  );
}
