import { useQuery } from 'react-query';
import { _Get } from '../shared/Http';
import { queries } from '../shared/Queries';
import { MonitorRespose } from '../types/taxonomy';

export const useMonitorState = (monitor_id: string) => useQuery(
  queries.monitor(monitor_id),
  () => _Get<MonitorRespose>('get_monitor', { id: monitor_id }),
  { enabled: !!monitor_id, refetchOnWindowFocus: false });
