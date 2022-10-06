import { useQuery } from 'react-query';
import { queries } from '../shared/Queries';
import { _Get } from '../shared/Http';
import { useState } from 'react';
import { HitsCountResponse } from '../types/taxonomy';

export const useHitsCountState = (monitor_id: string) => {
  const [interval, setInterval] = useState<number>(0);

  return useQuery(queries.hitsCount(monitor_id), () => _Get<HitsCountResponse>('get_hits_count', { id: monitor_id }), {
    refetchOnWindowFocus: false,
    refetchInterval: interval,
    onSuccess: (data) => !data.is_loading ? setInterval(0) : setInterval(3500),
    enabled: Boolean(monitor_id)
  })
}