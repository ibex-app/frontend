export type HitsCountTableItem = {
  key: string,
  search_term: string,
  facebook: string,
  youtube: string,
  twitter: string,
  vkontakte: string,
  telegram: string,
}

export type HitsCountItem = {
  "search_term": string,
  "facebook"?: number,
  "twitter"?: number,
  "youtube"?: number,
  "vkontakte"?: number,
  "telegram"?: number
};

export type HitsCountResponse = {
  search_terms: Array<HitsCountItem>
};

export type Monitor = {
  collect_actions: string[];
  date_from: Date | string,
  date_to?: Date,
  descr: string,
  title: string,
  _id: string
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

export type MonitorProgressResponse = {
  
}

export type FilterElem = { hasOp: boolean, left: string, right?: string, op?: string };

export type FilterElemPartial = { hasOp?: boolean, op?: string, s: string };