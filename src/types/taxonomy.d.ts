export type Monitor = {
  collect_actions: string[];
  date_from: Date | string,
  date_to?: Date,
  descr: string,
  title: string,
  _id: string
}

export type Progress = {
  finalized_collect_tasks_count: number,
  posts_count: number,
  tasks_count: number,
  time_estimate?: number,
  platform?: string
}

export type SearchTerm = {
  _id: string,
  tags: string[],
  term: string
}

export type MonitorRespose = {
  monitor: Monitor,
  search_term: SearchTerm[],
  accounts: Account[],
  platforms: Array[]
}

export type MonitorProgressResponse = Progress[]


export type FilterElem = { hasOp: boolean, left: string, right?: string, op?: string };

export type FilterElemPartial = { hasOp?: boolean, op?: string, s: string };

export type TaxonomyResponse = {

}