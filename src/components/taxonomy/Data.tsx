import { mapWithIndex } from "fp-ts/lib/Array";
import { fold } from "fp-ts/lib/Either";
import { pipe, prop } from "ramda";
import { formatNum } from "../../shared/Utils";
import { HitsCountItem, HitsCountItemWithKey, HitsCountTableItem } from "../../types/taxonomy";



export const generateHitsCountTableItem =
  (key: number | string, { search_term, facebook, youtube, twitter }: HitsCountItem): HitsCountItemWithKey => ({
    key: typeof key === 'number' ? key.toString() : key,
    search_term,
    facebook: facebook || facebook === 0 ? formatNum(facebook) : '-',
    youtube: youtube || youtube === 0 ? formatNum(youtube) : '-',
    twitter: twitter || twitter === 0 ? formatNum(twitter) : '-'
  })

export const generateHitsCountTableData = fold(
  () => [],
  pipe(
    prop<'search_terms', Array<HitsCountItem>>('search_terms'),
    mapWithIndex<HitsCountItem, HitsCountTableItem>(generateHitsCountTableItem)
  )
);