import { useQuery } from 'react-query';
import { queries } from '../shared/Queries';
import { _Get } from '../shared/Http';
import { useCallback, useState } from 'react';
import { HitsCountResponse } from '../types/hitscount';

export const useHitsCountState = (monitor_id: string, pristine: boolean) => {
  const [interval, setInterval] = useState<number>(0);
  const onSuccess = useCallback((data) => !data.is_loading && !pristine ? setInterval(0) : setInterval(3500), [pristine])

  return useQuery(queries.hitsCount(monitor_id), () => _Get<HitsCountResponse>('get_hits_count', { id: monitor_id }), {
    refetchOnWindowFocus: false,
    refetchInterval: interval,
    onSuccess,
    enabled: Boolean(monitor_id)
  })
}