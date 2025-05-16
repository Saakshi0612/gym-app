// hooks/useCoachData.ts
import { useState, useEffect } from 'react';
import { CoachFromApi } from '../types/components/coach.types';

export const useCoachData = (coachId: string | undefined) => {
  const [coach, setCoach] = useState<CoachFromApi | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachData = async () => {
      if (!coachId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://api-gateway-run8-1-team6-api-gateway-dev.development.krci-dev.cloudmentor.academy/api/coaches/${coachId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch coach data');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setCoach(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('Failed to load coach data');
        console.error('Error fetching coach data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoachData();
  }, [coachId]);

  return { coach, loading, error };
};