import { Form, Space, Table } from "antd";
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
  const [pristine, setPristine] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { userSelection, setUserSelection } = useContext(TaxonomyContext);

  const refetchInterval = useMemo(() => match([isLoading, pristine])
    .with([true, true], () => 3500)
    .otherwise(() => 0)
    , [isLoading, pristine]);

  const { data } = useHitsCountState(monitor_id, refetchInterval);
  const type = useMemo(() => data?.type, [data]);
  const dataFormatted = useMemo(() => data ? generateHitsCountTableData(data) : [], [data]);
  const [hitsCountTableData, setHitsCountTableData] = useState<HitsCountTableItem[]>([]);

  const [form] = useForm();

  useEffect(() => {
    data && setIsLoading(data?.is_loading);
  }, [data])

  useEffect(() => {
    dataFormatted.length && setHitsCountTableData(dataFormatted as any);
  }, [dataFormatted, setPristine]);

  const deleteSearchTerm = useCallback((searchTerm: string) => {
    setHitsCountTableData(hitsCountTableData.filter(({ title }) => searchTerm !== title));
  }, [hitsCountTableData]);

  const platforms = useMemo(() => data && data.type === 'search_terms' ? generatePlatforms(data.data) : [], [data]);

  const columns = useMemo(() => match(data)
    .with({ type: 'search_terms' }, () => platforms ? createSearchTermColumns(platforms, deleteSearchTerm) : [])
    .with({ type: 'accounts' }, () => createAccountColumns())
    .otherwise(() => [])
    , [data, deleteSearchTerm, platforms]);

  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountItem[]>([]);

  const hitCountSelection = useMemo(() => ({
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }), [hitCountsSelected]);

  const addNewHitsCount = useMemo(() => pipe(
    generateEmptyHitsCount,
    (tableItem) => concat([tableItem], hitsCountTableData),
    setHitsCountTableData
  ), [hitsCountTableData]);

  useEffect(() => {
    userSelection && addNewHitsCount(userSelection)
    setUserSelection('');
  }, [userSelection, addNewHitsCount]);

  const onHitsCountAdd = useCallback((values: string[]) => {
    addNewHitsCount(values[0])
    form.resetFields();
  }, [form, addNewHitsCount]);

  useEffect(() => setPristine(
    equals(hitsCountTableData, dataFormatted as any) || !hitsCountTableData.length
  ), [hitsCountTableData, dataFormatted]);

  useEffect(() => toParent && toParent({
    all: hitsCountTableData,
    selected: hitCountsSelected,
    type,
    platforms,
    pristine: pristine
  }), [hitCountsSelected, hitsCountTableData, type, platforms, dataFormatted, pristine]);

  return <div className="leftbox-inner">
    <Form form={form} onFinish={onHitsCountAdd}>
      <Space size="small">
        {getElem(hitsCountFormItem)}
        {getElem({ id: 1, type: "button", label: "Add" })}
      </Space>
    </Form>
    <Table
      rowKey='title'
      rowSelection={hitCountSelection}
      dataSource={hitsCountTableData}
      columns={columns as any} />
  </div>
}