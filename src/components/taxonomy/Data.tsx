import { mapWithIndex } from "fp-ts/lib/Array";
import { pipe, prop } from "ramda";
import { HitsCountItem, HitsCountTableItem } from "../../types/taxonomy";

export const generateEmptyHitsCount = (search_term: string): HitsCountItem => ({
  search_term,
  facebook: undefined,
  youtube: undefined,
  twitter: undefined,
  telegram: undefined,
  vkontakte: undefined,
})

export const generateHitsCountTableItem =
  (key: number | string, { search_term, facebook, youtube, twitter, vkontakte, telegram }: HitsCountItem): HitsCountTableItem => ({
    key: typeof key === 'number' ? key.toString() : `hitsCount-${key}`,
    search_term,
    facebook,
    youtube,
    twitter,
    telegram,
    vkontakte,
  })

export const generateHitsCountTableData = pipe(
  prop<'search_terms', Array<HitsCountItem>>('search_terms'),
  mapWithIndex<HitsCountItem, HitsCountTableItem>(generateHitsCountTableItem)
);