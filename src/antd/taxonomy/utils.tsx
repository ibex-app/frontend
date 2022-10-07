import { ColumnsType } from 'antd/lib/table';
import { formatNum, platformIcon } from '../../shared/Utils';
import { drawFilterItem } from '../../shared/Utils/Taxonomy';
import { AccountItem, HitsCountItem } from '../../types/hitscount';
import { match } from 'ts-pattern';
import { Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const renderCell = (value: number | undefined | null) => match(value)
  .with(null, () => <Spin />)
  .with(undefined, () => <span className="tax-null">-</span>)
  .with(-1, () => "N/A")
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

export const createAccountColumns = (): ColumnsType<AccountItem> => [
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
  }
]

export const generateEmptyHitsCount = (title: string) => ({
  title
})