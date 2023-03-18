import { pipe, prop } from "ramda";
import { match } from 'ts-pattern';
import { Account, HitsCountResponse, HitsCountSearchTerm } from "../../types/hitscount";

export const generateHitsCountTableData = (data: HitsCountResponse) => match(data)
  .with({ type: 'search_terms' }, pipe(prop<'data', Array<HitsCountSearchTerm>>('data')))
  .with({ type: 'accounts' }, pipe(prop<'data', Array<Account>>('data')))
  .otherwise(() => [])