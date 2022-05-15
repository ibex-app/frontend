export type HitsCountTableItem = {
  key: string,
  search_term: string,
  facebook: string,
  youtube: string,
  twitter: string
}

export type HitsCountItem = {
  search_term: string,
  facebook?: number,
  twitter?: number,
  youtube?: number,
  vkontakte?: number,
  telegram?: number
};

export interface HitsCountItemWithKey extends HitsCountItem {
  key: string,
  facebook: string,
  twitter: string,
  youtube: string
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

export type FilterElem = { hasOp: boolean, left: string, right?: string, op?: string };

export type FilterElemPartial = { hasOp: boolean, op: string, s: string };