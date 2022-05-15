import { mapWithIndex } from "fp-ts/lib/Array";
import { fold } from "fp-ts/lib/Either";
import { formatNum } from "../../shared/Utils";
import { HitsCountItem, HitsCountItemWithKey, HitsCountTableItem } from "../../types/taxonomy";

export const generateHitsCountTableItem =
  (key: number | string, { search_term, facebook, youtube, twitter }: HitsCountItem): HitsCountItemWithKey => ({
    key: typeof key === 'number' ? key.toString() : key,
    search_term,
    facebook: facebook ? formatNum(facebook) : '0',
    youtube: youtube ? formatNum(youtube) : '0',
    twitter: twitter ? formatNum(twitter) : '0'
  })

export const generateHitsCountTableData = fold(
  () => [],
  mapWithIndex<HitsCountItem, HitsCountTableItem>(generateHitsCountTableItem)
);