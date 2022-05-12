export type HitsCountTableData = {
  key: string,
  search_term: string,
  facebook: string,
  youtube: string,
  twitter: string
}

export type HitsCountTable = {
  columns: Array<any>,
  data: Array<any>
}

export type HitsCountItem = {
  search_term: string,
  facebook: number,
  twitter: number,
  youtube: number,
  vkontakte: number,
  telegram: number
};

export type HitsCountResponse = Array<HitsCountItem>;

export type Monitor = {
  collect_actions: string[];
  date_from: Date,
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
  accounts: Account[]
}