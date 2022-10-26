import { ColumnsType } from 'antd/lib/table';
import { formatNum, platformIcon } from '../../shared/Utils';
import { drawFilterItem } from '../../shared/Utils/Taxonomy';
import { AccountItem, HitsCountItem } from '../../types/hitscount';
import { match } from 'ts-pattern';
import Spinner from '../../antd/Spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Option } from '../../types/form';
import { anyPass, propSatisfies } from 'ramda';

export const hitsCountCalcItems = ['hits_count', 'facebook', 'telegram', 'twitter', 'youtube', 'vkontakte'];
const isOverLimit = propSatisfies(x => x > 10000)

export const hitsCountIsOverLimit = (hitsCount?: any[]) =>
  hitsCount && hitsCount.map(
    anyPass(hitsCountCalcItems.map(x => isOverLimit(x))))
    .reduce((acc, x) => acc || x, false);

const renderCell = (value: number | undefined | null) => match(value)
  .with(null, () => <Spinner />)
  .with(undefined, () => <span className="tax-null">-</span>)
  .with(-1, () => "N/A")
  .with(-2, () => "Error")
  .otherwise((val) => val &&
    <span className={val < 1 ? 'table-cell-gray' : val > 10000 ? 'table-cell-red' : ''}>
      {formatNum(val)}
    </span>
  )

export const createSearchTermColumns = (platforms: string[], deleteSearchTerm: any) => {
  let cols: ColumnsType<HitsCountItem> = [{
    title: "Keyword",
    dataIndex: "title",
    key: "title",
    render: (title: string) => title && drawFilterItem({ title })
  }];

  platforms.forEach(platform => {
    cols.push({
      title: platformIcon(platform),
      dataIndex: platform,
      key: platform,
      render: (text: number) => renderCell(text)
    });
  });

  cols.push({
    title: '',
    key: 'action',
    render: (_: any, { title }: any) => (
      // <Space size="middle" onClick=''>
      <span className="tax-delete" onClick={() => deleteSearchTerm(title)}>
        <FontAwesomeIcon icon={faTrashCan} />
      </span>
    ),
  });

  return cols;
};

export const createAccountColumns = (deleteSearchTerm: (title: string) => void): ColumnsType<AccountItem> => [
  {
    title: "Account",
    key: "title",
    dataIndex: "title",
    render: (title, { platform }) => <>{platformIcon(platform)} {title}</>
  }, {
    title: "Count",
    key: "hits_count",
    dataIndex: "hits_count",
    render: (text: number) => renderCell(text)
  }, {
    title: '',
    key: 'action',
    render: (_: any, { title }: any) => (
      // <Space size="middle" onClick=''>
      <span className="tax-delete" onClick={() => deleteSearchTerm(title)}>
        <FontAwesomeIcon icon={faTrashCan} />
      </span>
    ),
  }
]

export const generateEmptyHitsCount = (input: string | Option) => typeof input === 'string' ? ({
  title: input
}) : { title: input.label, ...input }