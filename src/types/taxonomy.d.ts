import { Account, AccountItem } from "./hitscount";

export type Monitor = {
  collect_actions: string[];
  date_from: Date | string,
  date_to?: Date,
  descr: string,
  title: string,
  _id: string
}

export type ProgressItem = {
  finalized_collect_tasks_count: number,
  failed_collect_tasks_count: number,
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

export interface MonitorRespose extends Monitor {
  search_terms: SearchTerm[],
  accounts: Account[],
  platforms: Array[]
}

export type MonitorProgressResponse = ProgressItem[]


export type FilterElem = { hasOp: boolean, left: string, right?: string, op?: string };

export type FilterElemPartial = { hasOp?: boolean, op?: string, s: string };

export type TaxonomyResponse = {

}