type SecurityEventType = 
  | 'honeypot_triggered'
  | 'rate_limit_hit'
  | 'suspicious_pattern'
  | 'validation_failed';

interface SecurityEventDetails {
  reason?: string;
  source?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export async function logSecurityEvent(
  eventType: SecurityEventType,
  source: string,
  details?: SecurityEventDetails
): Promise<void> {
  try {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
    
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-security-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        eventType,
        source,
        details: {
          ...details,
          userAgent,
        },
      }),
    });
  } catch {
    // Silencioso - no interrumpir el flujo del usuario
  }
}

// Detectar patrones sospechosos en texto
export function detectSuspiciousPattern(message: string): { isSuspicious: boolean; reason?: string } {
  // Muchos enlaces
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 2) {
    return { isSuspicious: true, reason: 'excessive_urls' };
  }

  // Tags de script o SQL injection
  if (/<script|javascript:|onclick|onerror/i.test(message)) {
    return { isSuspicious: true, reason: 'script_injection' };
  }

  // SQL injection patterns
  if (/(\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bUNION\b).*(\bFROM\b|\bINTO\b|\bTABLE\b)/i.test(message)) {
    return { isSuspicious: true, reason: 'sql_injection' };
  }

  // Mensajes repetitivos (mismo texto 3+ veces)
  const words = message.toLowerCase().split(/\s+/);
  const wordCounts = new Map<string, number>();
  for (const word of words) {
    if (word.length > 3) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }
  for (const count of wordCounts.values()) {
    if (count > 5) {
      return { isSuspicious: true, reason: 'repetitive_content' };
    }
  }

  return { isSuspicious: false };
}
