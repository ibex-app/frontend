import { Form, Input, Space, Table } from "antd";
import { concat, keys, pipe, equals } from "ramda";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateHitsCountTableData } from "../../components/taxonomy/Data";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { hitsCountFormItem } from "../../data/taxonomy/HitCounts";
import { HitsCountItem, HitsCountSearchTerm, HitsCountTableItem } from "../../types/hitscount";
import { getElem } from "../utils/ElementGetter";
import { match } from "ts-pattern";
import { useHitsCountState } from '../../state/useHitsCountState';
import { useForm } from 'antd/lib/form/Form';
import { createAccountColumns, createSearchTermColumns, generateEmptyHitsCount } from './utils';

type Input = {
  monitor_id: string,
  toParent?: (output: any) => void;
}

export type HitsCountOutput = {
  type?: 'search_terms' | 'accounts';
  selected?: HitsCountTableItem[],
  all?: HitsCountTableItem[],
  platforms?: string[],
  pristine?: boolean
}

const generatePlatforms = (data: Array<HitsCountSearchTerm>) =>
  data.reduce((acc, curr) => {
    keys(curr).forEach(key => match(key)
      .with('item', 'title', 'id', () => acc)
      .otherwise(() => !acc.includes(key) && acc.push(key))
    );

    return acc;
  }, [] as string[]);

export const HitsCount = ({ monitor_id, toParent }: Input) => {
  const { data } = useHitsCountState(monitor_id);
  const dataFormatted = useMemo(() => data ? generateHitsCountTableData(data) : [], [data]);
  const [hitsCountTableData, setHitsCountTableData] = useState<HitsCountTableItem[]>([]);
  const [newHitsCount, setNewHitsCount] = useState<HitsCountTableItem[]>([]);
  const type = useMemo(() => data?.type, [data]);

  const [form] = useForm();

  const deleteSearchTerm = useCallback((searchTerm: string) => {
    setHitsCountTableData(hitsCountTableData.filter(({ title }) => searchTerm !== title));
    setNewHitsCount(newHitsCount.filter(({ title }) => searchTerm !== title));
  }, [hitsCountTableData, newHitsCount]);

  const platforms = useMemo(() => data && data.type == 'search_terms' ? generatePlatforms(data.data) : [], [data]);

  const columns = useMemo(() => match(data)
    .with({ type: 'search_terms' }, ({ data }) => platforms ? createSearchTermColumns(platforms, deleteSearchTerm) : [])
    .with({ type: 'accounts' }, () => createAccountColumns())
    .otherwise(() => [])
    , [data, deleteSearchTerm, platforms]);

  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountItem[]>([]);

  const { userSelection, setUserSelection } = useContext(TaxonomyContext);

  useEffect(() => setHitsCountTableData(concat(newHitsCount, dataFormatted as any || [])), [newHitsCount, dataFormatted]);

  const hitCountSelection = useMemo(() => ({
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }), [hitCountsSelected]);

  const addNewHitsCount = useMemo(() => pipe(
    generateEmptyHitsCount,
    // ({ search_term, ...rest }) => generateHitsCountTableItem(search_term, { item: { term: search_term }, ...rest }),
    (tableItem) => concat([tableItem], newHitsCount),
    setNewHitsCount
  ), [newHitsCount, setNewHitsCount]);

  useEffect(() => {
    userSelection && addNewHitsCount(userSelection)
  }, [userSelection, addNewHitsCount]);

  const onHitsCountAdd = useCallback((values: string[]) => {
    console.log(values)
    addNewHitsCount(values[0])
    form.resetFields();
  }, [form, addNewHitsCount]);

  useEffect(() => toParent && toParent({
    all: hitsCountTableData,
    selected: hitCountsSelected,
    type,
    platforms,
    pristine: equals(hitsCountTableData, dataFormatted as any) || !hitsCountTableData.length
  }), [hitCountsSelected, hitsCountTableData, type, platforms]);

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
      columns={columns as any} />
  </div>
}