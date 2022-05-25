import { Form, Input, Space, Table } from "antd";
import { concat, pipe, prop } from "ramda";
import { useContext, useEffect, useState } from "react";
import { generateHitsCountTableData, generateHitsCountTableItem } from "../../components/taxonomy/Data";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { hitCountCols, hitsCountFormItem } from "../../data/taxonomy/HitCounts";
import { Get } from "../../shared/Http";
import { HitsCountItemWithKey, HitsCountResponse, HitsCountTableItem } from "../../types/taxonomy";
import { getElem } from "../utils/ElementGetter";

type Input = {
  monitor_id: string,
  toParent?: (output: HitsCountOutput) => void;
}

export type HitsCountOutput = {
  selected: HitsCountTableItem[],
  all?: HitsCountTableItem[],
  new?: HitsCountItemWithKey[]
}

export const HitsCount = ({ monitor_id, toParent }: Input) => {
  const [data, setData] = useState<HitsCountTableItem[]>();
  const [hitsCountTableData, setHitsCountTableData] = useState<HitsCountTableItem[]>();
  const [newHitsCount, setNewHitsCount] = useState<HitsCountItemWithKey[]>();
  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountTableItem[]>([]);
  const { userSelection } = useContext(TaxonomyContext);

  useEffect(() => {
    Get<HitsCountResponse>('get_hits_count', { id: monitor_id }).then(pipe(generateHitsCountTableData, setData));
  }, [monitor_id]);

  useEffect(() => {
    setHitsCountTableData(data);
    toParent && toParent({
      selected: hitCountsSelected,
      new: newHitsCount,
      all: data
    })
  }, [data]);

  useEffect(() => {
    if (toParent) toParent({
      selected: hitCountsSelected,
      new: newHitsCount,
      all: data
    });
  }, [hitCountsSelected, newHitsCount]);

  useEffect(() => {
    if (newHitsCount) setHitsCountTableData(data ? concat(newHitsCount, data) : newHitsCount);
  }, [newHitsCount]);

  const hitCountSelection = {
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }

  const addNewHitsCount = pipe(
    (keyword: string) => generateHitsCountTableItem(keyword, { search_term: keyword }),
    (item: HitsCountItemWithKey) => newHitsCount ? concat([item], newHitsCount) : [item],
    setNewHitsCount
  )

  useEffect(() => {
    userSelection && addNewHitsCount(userSelection)
  }, [userSelection])

  return <div className="leftbox-inner">
    <Form onFinish={(obj) => addNewHitsCount(obj[0])}>
      <Space size="small">
        {getElem(hitsCountFormItem)}
        {getElem({ id: 1, type: "button", label: "Add" })}
      </Space>
    </Form>
    <Table rowSelection={hitCountSelection} columns={hitCountCols} dataSource={hitsCountTableData} />
  </div>
}