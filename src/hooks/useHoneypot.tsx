import { useState, useCallback, useRef } from 'react';

interface HoneypotConfig {
  fieldName?: string;
  minSubmitTime?: number; // Tiempo mínimo en ms para enviar
}

interface HoneypotResult {
  honeypotField: string;
  honeypotValue: string;
  setHoneypotValue: (value: string) => void;
  checkHoneypot: () => { isBot: boolean; reason?: string };
  formLoadTime: number;
}

export function useHoneypot({
  fieldName = 'website_url',
  minSubmitTime = 2000, // 2 segundos mínimo
}: HoneypotConfig = {}): HoneypotResult {
  const [honeypotValue, setHoneypotValue] = useState('');
  const formLoadTime = useRef(Date.now());

  const checkHoneypot = useCallback((): { isBot: boolean; reason?: string } => {
    // Check 1: El campo honeypot debe estar vacío
    if (honeypotValue.trim() !== '') {
      return {
        isBot: true,
        reason: 'honeypot_filled',
      };
    }

    // Check 2: El formulario debe haber estado cargado al menos X ms
    const elapsedTime = Date.now() - formLoadTime.current;
    if (elapsedTime < minSubmitTime) {
      return {
        isBot: true,
        reason: 'too_fast_submission',
      };
    }

    return { isBot: false };
  }, [honeypotValue, minSubmitTime]);

  return {
    honeypotField: fieldName,
    honeypotValue,
    setHoneypotValue,
    checkHoneypot,
    formLoadTime: formLoadTime.current,
  };
}
