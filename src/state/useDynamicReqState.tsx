import { useQuery } from 'react-query'
import { _Get } from '../shared/Http'

export const useDynamicReqState = <T,>(path: string, params: any) => useQuery([path, params.substring], () => _Get<T>(path, params), {
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  enabled: Boolean(path) && Boolean(params.substring),
})