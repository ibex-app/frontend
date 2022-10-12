import { useQuery } from 'react-query';
import { queries } from '../shared/Queries';
import { _Get } from '../shared/Http';
import { useCallback, useState } from 'react';
import { HitsCountResponse } from '../types/hitscount';
import { match } from 'ts-pattern';

export const useHitsCountState = (monitor_id: string, pristine: boolean) => {
  const [interval, setInterval] = useState<number>(0);
  const onSuccess = useCallback(({ is_loading }) => {
    match([is_loading, pristine])
      .with([true, true], () => setInterval(3500))
      .otherwise(() => setInterval(0));
  }, [pristine]);

  return useQuery(queries.hitsCount(monitor_id), () => _Get<HitsCountResponse>('get_hits_count', { id: monitor_id }), {
    refetchOnWindowFocus: false,
    refetchInterval: interval,
    onSuccess,
    enabled: Boolean(monitor_id)
  })
}