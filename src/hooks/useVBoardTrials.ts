import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateDeviceFingerprint } from '@/lib/deviceFingerprint';

interface TrialStatus {
  trialsUsed: number;
  maxTrials: number;
  trialsRemaining: number;
  canUse: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useVBoardTrials() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [status, setStatus] = useState<TrialStatus>({
    trialsUsed: 0,
    maxTrials: 3,
    trialsRemaining: 3,
    canUse: true,
    isLoading: true,
    error: null,
  });

  // Generate fingerprint on mount
  useEffect(() => {
    generateDeviceFingerprint()
      .then(setFingerprint)
      .catch(err => {
        console.error('Failed to generate fingerprint:', err);
        setStatus(prev => ({ ...prev, isLoading: false, error: 'Failed to initialize' }));
      });
  }, []);

  // Fetch trial status when fingerprint is ready
  useEffect(() => {
    if (!fingerprint) return;

    const fetchTrialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('vboard_trials')
          .select('trials_used, max_trials')
          .eq('device_fingerprint', fingerprint)
          .maybeSingle();

        if (error) {
          console.error('Error fetching trial status:', error);
          setStatus(prev => ({ ...prev, isLoading: false, error: error.message }));
          return;
        }

        if (data) {
          const trialsRemaining = data.max_trials - data.trials_used;
          setStatus({
            trialsUsed: data.trials_used,
            maxTrials: data.max_trials,
            trialsRemaining,
            canUse: trialsRemaining > 0,
            isLoading: false,
            error: null,
          });
        } else {
          // No record yet, user has all trials available
          setStatus({
            trialsUsed: 0,
            maxTrials: 3,
            trialsRemaining: 3,
            canUse: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error('Error in fetchTrialStatus:', err);
        setStatus(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        }));
      }
    };

    fetchTrialStatus();
  }, [fingerprint]);

  const consumeTrial = useCallback(async (): Promise<boolean> => {
    if (!fingerprint || !status.canUse) {
      return false;
    }

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('vboard_trials')
        .select('id, trials_used')
        .eq('device_fingerprint', fingerprint)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const newTrialsUsed = existing.trials_used + 1;
        const { error } = await supabase
          .from('vboard_trials')
          .update({ 
            trials_used: newTrialsUsed,
            last_used_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;

        setStatus(prev => ({
          ...prev,
          trialsUsed: newTrialsUsed,
          trialsRemaining: prev.maxTrials - newTrialsUsed,
          canUse: newTrialsUsed < prev.maxTrials,
        }));
      } else {
        // Create new record
        const { error } = await supabase
          .from('vboard_trials')
          .insert({
            device_fingerprint: fingerprint,
            trials_used: 1,
            max_trials: 3,
          });

        if (error) throw error;

        setStatus(prev => ({
          ...prev,
          trialsUsed: 1,
          trialsRemaining: 2,
          canUse: true,
        }));
      }

      return true;
    } catch (err) {
      console.error('Error consuming trial:', err);
      setStatus(prev => ({ 
        ...prev, 
        error: err instanceof Error ? err.message : 'Failed to use trial' 
      }));
      return false;
    }
  }, [fingerprint, status.canUse]);

  return {
    ...status,
    consumeTrial,
    fingerprint,
  };
}
