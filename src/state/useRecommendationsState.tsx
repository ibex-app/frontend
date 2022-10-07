import { useState } from 'react';
import { useQuery } from 'react-query';
import { _Get } from '../shared/Http';
import { queries } from '../shared/Queries';
import { Recommendations } from '../types/hitscount';

export const useRecommendationsState = (monitor_id: string) => {
  const [interval, setInterval] = useState(0);

  return useQuery(
    queries.recommendations(monitor_id),
    () => _Get<Recommendations>('recommendations', { id: monitor_id }),
    {
      enabled: !!monitor_id,
      refetchInterval: interval,
      onSuccess: (data) => {
        !!data.length && setInterval(3500)
      }
    });
};