import { mapWithIndex } from "fp-ts/lib/Array";
import { pipe, prop } from "ramda";
import { HitsCountItem, HitsCountTableItem } from "../../types/taxonomy";

export const generateEmptyHitsCount = (search_term: string): HitsCountTableItem => ({
  key: search_term,
  search_term,
  facebook: undefined,
  youtube: undefined,
  twitter: undefined,
  telegram: undefined,
  vkontakte: undefined,
})

export const generateHitsCountTableItem =
  (key: number | string, { item, facebook, youtube, twitter, vkontakte, telegram }: HitsCountItem): HitsCountTableItem => ({
    key: typeof key === 'number' ? key.toString() : `hitsCount-${key}`,
    search_term: item.term,
    facebook,
    youtube,
    twitter,
    telegram,
    vkontakte,
  })

export const generateHitsCountTableData = pipe(
  prop<'data', Array<HitsCountItem>>('data'),
  mapWithIndex<HitsCountItem, HitsCountTableItem>(generateHitsCountTableItem)
);