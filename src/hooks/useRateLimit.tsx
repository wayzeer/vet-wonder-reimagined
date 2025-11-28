import { useState, useCallback, useEffect } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  storageKey: string;
}

interface RateLimitData {
  count: number;
  resetTime: number;
}

export function useRateLimit({ maxAttempts, windowMs, storageKey }: RateLimitConfig) {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now();
    const stored = localStorage.getItem(storageKey);
    
    let data: RateLimitData;
    
    if (stored) {
      data = JSON.parse(stored);
      
      // Reset if window has passed
      if (now > data.resetTime) {
        data = { count: 0, resetTime: now + windowMs };
      }
    } else {
      data = { count: 0, resetTime: now + windowMs };
    }
    
    // Check if rate limited
    if (data.count >= maxAttempts) {
      const timeLeft = Math.ceil((data.resetTime - now) / 1000);
      setIsRateLimited(true);
      setRemainingTime(timeLeft);
      return false;
    }
    
    // Increment counter
    data.count++;
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    setIsRateLimited(false);
    return true;
  }, [maxAttempts, windowMs, storageKey]);

  const resetRateLimit = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsRateLimited(false);
    setRemainingTime(0);
  }, [storageKey]);

  // Update remaining time countdown
  useEffect(() => {
    if (!isRateLimited || remainingTime <= 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const data: RateLimitData = JSON.parse(stored);
        const timeLeft = Math.ceil((data.resetTime - now) / 1000);
        
        if (timeLeft <= 0) {
          resetRateLimit();
        } else {
          setRemainingTime(timeLeft);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRateLimited, remainingTime, storageKey, resetRateLimit]);

  return {
    checkRateLimit,
    isRateLimited,
    remainingTime,
    resetRateLimit,
  };
}