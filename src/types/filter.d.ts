type Filter = {
  monitor_id: string,
  time_interval_from?: string,
  time_interval_to?: string,
  author_platform_id?: string,
  topics?: string[],
  persons?: string[],
  locations?: string[],
  post_contains?: string,
  search_terms?: string[],
  hasVideo?: boolean
}