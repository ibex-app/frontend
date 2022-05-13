import { mapWithIndex } from "fp-ts/lib/Array";
import { fold } from "fp-ts/lib/Either";
import { formatNum } from "../../shared/Utils";
import { HitsCountItem, HitsCountTableData } from "../../types/taxonomy";

export const generateHitsCountTableData = fold(
  () => [],
  mapWithIndex<HitsCountItem, HitsCountTableData>((key, { search_term, facebook, youtube, twitter }) => ({
    key: key.toString(),
    search_term,
    facebook: formatNum(facebook) || '0',
    youtube: formatNum(youtube) || '0',
    twitter: formatNum(twitter) || '0',
  }))
);