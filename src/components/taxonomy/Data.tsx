import { mapWithIndex } from "fp-ts/lib/Array";
import { fold } from "fp-ts/lib/Either";
import { pipe, prop } from "ramda";
import { formatNum } from "../../shared/Utils";
import { HitsCountItem, HitsCountTableItem } from "../../types/taxonomy";



export const generateHitsCountTableItem =
  (key: number | string, { search_term, facebook, youtube, twitter, vkontakte, telegram }: HitsCountItem): HitsCountTableItem => ({
    key: typeof key === 'number' ? key.toString() : `hitsCount-${key}`,
    search_term,
    facebook: facebook,
    youtube: youtube,
    twitter: twitter,
    telegram: telegram,
    vkontakte: vkontakte,
  })

export const generateHitsCountTableData = fold(
  () => [],
  pipe(
    prop<'search_terms', Array<HitsCountItem>>('search_terms'),
    mapWithIndex<HitsCountItem, HitsCountTableItem>(generateHitsCountTableItem)
  )
);