import { useMutation, useQueryClient } from 'react-query';
import { _Get } from '../shared/Http';
import { queries } from '../shared/Queries';

export const useUpdateMonitorMutation = (monitor_id: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (formData: any) => _Get('update_monitor', { monitor_id, ...formData }),
    {
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries(queries.monitor(monitor_id)),
          queryClient.invalidateQueries(queries.hitsCount(monitor_id)),
          queryClient.invalidateQueries(queries.posts({ monitor_id })),
          queryClient.invalidateQueries(queries.recommendations(monitor_id))
        ])
      }
    }
  )
}