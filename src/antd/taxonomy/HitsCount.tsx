import { Form, Modal, Space, Table } from "antd";
import { concat, keys, pipe, equals } from "ramda";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { generateHitsCountTableData } from "../../components/taxonomy/Data";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { accountHitsCountFormItem, hitsCountFormItem } from "../../data/taxonomy/HitCounts";
import { HitsCountItem, HitsCountSearchTerm, HitsCountTableItem } from "../../types/hitscount";
import { getElem } from "../utils/ElementGetter";
import { match } from "ts-pattern";
import { useHitsCountState } from '../../state/useHitsCountState';
import { useForm } from 'antd/lib/form/Form';
import { createAccountColumns, createSearchTermColumns, generateEmptyHitsCount } from './utils';
import { Option } from '../../types/form';

type Input = {
  monitor_id: string,
  toParent?: (output: any) => void;
}

export type HitsCountOutput = {
  type?: 'search_terms' | 'accounts';
  selected?: HitsCountTableItem[],
  all?: HitsCountTableItem[],
  pristine?: boolean,
  is_loading?: boolean
}

const generatePlatforms = (data: Array<HitsCountSearchTerm>) =>
  data.reduce((acc, curr) => {
    keys(curr).forEach(key => match(key)
      .with('item', 'title', 'id', () => acc)
      .otherwise(() => !acc.includes(key) && acc.push(key))
    );

    return acc;
  }, [] as string[]);

const errorModal = Modal.error;

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
  const accounts = Form.useWatch('accounts', form);

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
    .with({ type: 'accounts' }, () => createAccountColumns(deleteSearchTerm))
    .otherwise(() => [])
    , [data, deleteSearchTerm, platforms]);

  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountItem[]>([]);

  const hitCountSelection = useMemo(() => ({
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }), [hitCountsSelected]);

  const preNewProcessHitsCcount = (newKeyword: string) => {
    const newKeywordClear = newKeyword.replace(/[^\w\s]/gi, '')
    return newKeywordClear
  }
  
  const addNewHitsCount = useMemo(() => pipe(
    preNewProcessHitsCcount,
    generateEmptyHitsCount,
    (tableItem) => concat([tableItem], hitsCountTableData),
    setHitsCountTableData
  ), [hitsCountTableData]);

  useEffect(() => {
    userSelection && addNewHitsCount(userSelection)
    setUserSelection('');
  }, [userSelection, addNewHitsCount]);

  const onHitsCountAdd = useCallback((values: any) => {
    const val = !!values.length ? values[0] : values.search_terms;
    const t = typeof val === 'string' ? val : val[0];

    if (hitsCountTableData?.find(
      ({ title, platform_id }: any) =>
        (t.platform_id === platform_id && t.label === title) || (typeof t === 'string' && title.toLowerCase() === t.toLowerCase()))
    ) {
      errorModal({ title: 'Error', content: 'Item term already exists' });
      form.resetFields();
      return
    }

    addNewHitsCount(typeof val === 'string' ? val : val[0]);
    form.resetFields();
  }, [form, addNewHitsCount, dataFormatted]);

  useEffect(() => setPristine(
    equals(hitsCountTableData, dataFormatted as any) || !hitsCountTableData.length
  ), [hitsCountTableData, dataFormatted]);

  useEffect(() => toParent && toParent({
    all: hitsCountTableData,
    selected: hitCountsSelected,
    type,
    pristine: pristine,
    is_loading: isLoading
  }), [hitCountsSelected, hitsCountTableData, type, dataFormatted, pristine, isLoading]);

  useEffect(() => {
    if (accounts && typeof accounts[0] === 'object') {
      onHitsCountAdd([accounts]);
    }
  }, [accounts, onHitsCountAdd]);

  return <div className="leftbox-inner">
    <Form form={form} onFinish={onHitsCountAdd} >
      <Space size="small" className={type === 'accounts' ? 'tax-no-button' : ''}>
        {getElem(type === 'accounts' ? accountHitsCountFormItem : hitsCountFormItem)}
        {type !== 'accounts' ? getElem({ id: 1, type: "button", label: "Add" }) : ''}
      </Space>
    </Form>
    <Table
      rowKey='id'
      rowSelection={hitCountSelection}
      dataSource={hitsCountTableData}
      pagination={{ defaultPageSize: 8 }}
      columns={columns as any} />
  </div>
}