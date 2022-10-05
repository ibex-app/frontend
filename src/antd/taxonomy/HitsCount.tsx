import { Form, Input, Space, Spin, Table } from "antd";
import { concat, keys, pipe } from "ramda";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateEmptyHitsCount, generateHitsCountTableData, generateHitsCountTableItem } from "../../components/taxonomy/Data";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hitsCountFormItem } from "../../data/taxonomy/HitCounts";
import { HitsCountResponse, HitsCountTableItem } from "../../types/taxonomy";
import { getElem } from "../utils/ElementGetter";
import { platformIcon } from "../../shared/Utils";
import { match } from "ts-pattern";
import { ColumnsType } from "antd/lib/table";
import { formatNum } from "../../shared/Utils";
import { useHitsCountState } from '../../state/useHitsCountState';
import { useForm } from 'antd/lib/form/Form';

type Input = {
  monitor_id: string,
  toParent?: (output: HitsCountOutput) => void;
}

export type HitsCountOutput = {
  selected?: HitsCountTableItem[],
  all?: HitsCountTableItem[],
  platforms?: string[]
}
const renderCell = (value: number | undefined | null) => match(value)
  .with(null, () => <Spin />)
  .with(undefined, () => <span className="tax-null">-</span>)
  .with(-1, () => "N/A")
  .otherwise((val) => val &&
    <span className={val < 1 ? 'table-cell-gray' : val > 10000 ? 'table-cell-red' : ''}>
      {formatNum(val)}
    </span>
  )

const createColumns = (platforms: string[], deleteSearchTerm: any) => {
  let cols: ColumnsType<HitsCountTableItem> = [{
    title: "Keyword",
    dataIndex: "search_term",
    key: "search_term",
    render: (text: string) => text && drawFilterItem({ search_term: text })
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
    render: (_: any, { search_term }: any) => (
      // <Space size="middle" onClick=''>
      <span className="tax-delete" onClick={() => deleteSearchTerm(search_term)}>
        <FontAwesomeIcon icon={faTrashCan} />
      </span>
    ),
  });

  return cols;
};

const generatePlatforms = ({ data }: HitsCountResponse) =>
  data.reduce((acc, curr) => {
    keys(curr).forEach(key => {
      if (key !== 'item' && !acc.includes(key)) acc.push(key);
    });

    return acc;
  }, [] as string[]);

export const HitsCount = ({ monitor_id, toParent }: Input) => {
  const { data } = useHitsCountState(monitor_id);
  const dataFormatted = useMemo(() => data ? generateHitsCountTableData(data) : [], [data]);
  const [newHitsCount, setNewHitsCount] = useState<HitsCountTableItem[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);

  const [form] = useForm();

  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountTableItem[]>([]);
  const platforms = useMemo(() => data && generatePlatforms(data), [data]);

  const { userSelection } = useContext(TaxonomyContext);

  const hitsCountTableData = useMemo(() =>
    concat(newHitsCount, dataFormatted || [])
      .filter(({ search_term }) => !deleted.includes(search_term))
    , [newHitsCount, dataFormatted, deleted]);

  const deleteSearchTerm = (searchTerm: string) => setDeleted([...deleted, searchTerm]);

  const removeDeletion = (searchTerm: string) => {
    setDeleted(deleted.filter(term => term !== searchTerm));
    return searchTerm;
  }

  useEffect(() => toParent && toParent({ all: hitsCountTableData }), [hitsCountTableData]);

  useEffect(() => toParent && toParent({ selected: hitCountsSelected }), [hitCountsSelected]);

  useEffect(() => toParent && toParent({ platforms }), [platforms]);

  const hitCountSelection = {
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }

  const addNewHitsCount = pipe(
    removeDeletion,
    generateEmptyHitsCount,
    ({ search_term, ...rest }) => generateHitsCountTableItem(search_term, { item: { term: search_term }, ...rest }),
    (tableItem) => concat([tableItem], newHitsCount),
    setNewHitsCount
  )

  useEffect(() => {
    userSelection && addNewHitsCount(userSelection)
  }, [userSelection])

  const onHitsCountAdd = useCallback((values: string[]) => {
    addNewHitsCount(values[0])
    form.resetFields();
  }, [form, addNewHitsCount]);

  return <div className="leftbox-inner">
    <Form form={form} onFinish={onHitsCountAdd}>
      <Space size="small">
        {getElem(hitsCountFormItem)}
        {getElem({ id: 1, type: "button", label: "Add" })}
      </Space>
    </Form>
    <Table
      rowSelection={hitCountSelection}
      dataSource={hitsCountTableData}
      columns={platforms && createColumns(platforms, deleteSearchTerm)} />
  </div>
}