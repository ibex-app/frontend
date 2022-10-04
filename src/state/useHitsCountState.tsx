import { useQuery } from 'react-query';
import { queries } from '../shared/Queries';
import { _Get } from '../shared/Http';
import { useState } from 'react';
import { HitsCountResponse } from '../types/taxonomy';

const isFullSingle = (hitsCountItem: any) => Object.keys(hitsCountItem)
  .reduce((isfull, key) => hitsCountItem[key] === null ? false : isfull, true)


const isFull = (hitsCountResponse: HitsCountResponse) => Boolean(hitsCountResponse.search_terms
  && hitsCountResponse.search_terms.length
  && hitsCountResponse.search_terms.length > 0
  && hitsCountResponse.search_terms.map(isFullSingle).every((isFull_: boolean) => isFull_))

export const useHitsCountState = (monitor_id: string) => {
  const [interval, setInterval] = useState<number>(0);

  return useQuery(queries.hitsCount(monitor_id), () => _Get<HitsCountResponse>('get_hits_count', { id: monitor_id }), {
    refetchOnWindowFocus: false,
    refetchInterval: interval,
    onSuccess: (data) => isFull(data) ? setInterval(0) : setInterval(5000),
    enabled: Boolean(monitor_id)
  })
}