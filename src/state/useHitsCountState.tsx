import { useQuery } from 'react-query';
import { queries } from '../shared/Queries';
import { _Get } from '../shared/Http';
import { HitsCountResponse } from '../types/hitscount';

export const useHitsCountState = (monitor_id: string, refetchInterval: number) =>
  useQuery(queries.hitsCount(monitor_id), () => _Get<HitsCountResponse>('get_hits_count', { id: monitor_id }), {
    refetchOnWindowFocus: false,
    refetchInterval,
    enabled: Boolean(monitor_id)
  })