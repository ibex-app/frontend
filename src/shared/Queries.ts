export const queries = {
  posts: (params: any) => ['posts', params],
  hitsCount: (monitor_id: string) => ['hitsCount', monitor_id],
  monitor: (monitor_id: string) => ['monitor', monitor_id],
  recommendations: (monitor_id: string) => ['recommendations', monitor_id],
}