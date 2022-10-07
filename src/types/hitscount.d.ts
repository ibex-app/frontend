export type AccountItem = {
  _id: string,
  title: string,
  platform: string,
  platform_id: string,
  program_title: null | string,
  url: string,
  img: null | string,
  tags: string[],
  broadcasting_start_time: null | string,
  broadcasting_end_time: null | string,
}

type Account = {
  hits_count?: null | number,
  item?: AccountItem,
  id?: string,
  title: string,
  platform?: string,
  url?: string
}

type AccountItemRes = {
  type: 'accounts',
  is_loading: boolean,
  data: Account[]
}

export type SearchTermItem = {
  tags: string[],
  term: string,
  _id: string
}

type NumNullUndef = number | null | undefined

export type HitsCountSearchTerm = {
  item?: SearchTermItem,
  id?: string,
  title: string,
  "facebook"?: NumNullUndef,
  "twitter"?: NumNullUndef,
  "youtube"?: NumNullUndef,
  "vkontakte"?: NumNullUndef,
  "telegram"?: NumNullUndef
};

type HitsCountSearchTermRes = {
  type: 'search_terms',
  is_loading: boolean,
  data: Array<HitsCountSearchTerm>
}

export type Recommendations = {
  word: string,
  score: number
}[]

export type HitsCountItem = SearchTermItem | AccountItem

export type HitsCountTableItem = HitsCountSearchTerm | AccountItem

export type HitsCountResponse = HitsCountSearchTermRes | AccountItemRes