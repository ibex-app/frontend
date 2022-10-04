export const queries = {
  posts: (params: any) => ['posts', params],
  hitsCount: (monitor_id: string) => ['hitsCount', monitor_id]
}