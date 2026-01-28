import { useState, useEffect, useCallback } from 'react';

/**
 * Neo AI trials hook - now with unlimited usage
 * Trial tracking is disabled but hook maintains compatibility
 */
export function useVBoardTrials() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Always allow unlimited usage
  const trialsRemaining = 999;
  const canUse = true;

  useEffect(() => {
    // Simulate quick load for UI consistency
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const consumeTrial = useCallback(async (): Promise<boolean> => {
    // No-op - always returns true for unlimited usage
    return true;
  }, []);

  return {
    trialsRemaining,
    canUse,
    isLoading,
    consumeTrial,
  };
}
