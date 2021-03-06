import { Form, Input, Space, Table } from "antd";
import { concat, keys, pipe, prop } from "ramda";
import { useContext, useEffect, useState } from "react";
import { generateHitsCountTableData, generateHitsCountTableItem } from "../../components/taxonomy/Data";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
// import { hitCountCols, hitsCountFormItem } from "../../data/taxonomy/HitCounts";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { hitsCountFormItem } from "../../data/taxonomy/HitCounts";
import { Get } from "../../shared/Http";
import { HitsCountItemWithKey, HitsCountResponse, HitsCountTableItem, HitsCountItem } from "../../types/taxonomy";
import { getElem } from "../utils/ElementGetter";
import { fold, left, right } from "fp-ts/lib/Either";
import { platformIcon, then } from "../../shared/Utils";
import { match } from "ts-pattern";
import { ColumnsType } from "antd/lib/table";

type Input = {
  monitor_id: string,
  toParent?: (output: HitsCountOutput) => void;
}

export type HitsCountOutput = {
  selected: HitsCountTableItem[],
  all?: HitsCountTableItem[],
  new?: HitsCountItemWithKey[],
  deleted?: boolean;
}

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
    });
  });

  cols.push({
    title: '',
    key: 'action',
    render: (_: any, record: any) => (
      // <Space size="middle" onClick=''>
      <span className="tax-delete" onClick={() => deleteSearchTerm(record)}>
        <FontAwesomeIcon icon={faTrashCan} />
      </span>
    ),
  });

  return cols;
};

const generatePlatforms = ({ search_terms }: HitsCountResponse) =>
  search_terms.reduce((acc, curr) => {
    keys(curr).forEach(key => {
      if (key !== 'search_term' && !acc.includes(key) && curr[key] && curr[key]! > 0) acc.push(key);
    });

    return acc;
  }, [] as string[]);

export const HitsCount = ({ monitor_id, toParent }: Input) => {
  const [data, setData] = useState<HitsCountTableItem[]>();
  const [hitsCountTableData, setHitsCountTableData] = useState<HitsCountTableItem[]>();
  const [newHitsCount, setNewHitsCount] = useState<HitsCountItemWithKey[] | undefined>();
  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeout, setTimeout_] = useState<NodeJS.Timeout>();
  const [platforms, setPlatforms] = useState<string[]>();

  const { userSelection } = useContext(TaxonomyContext);

  const deleteSearchTerm = (SearchTerm: any) => {
    if (!hitsCountTableData) return;
    const newhitsCountTableData = hitsCountTableData.filter((SearchTerm_: any) => SearchTerm_.search_term !== SearchTerm.search_term)
    setHitsCountTableData(newhitsCountTableData);
    setNewHitsCount(newHitsCount?.filter((SearchTerm_: any) => SearchTerm_.search_term !== SearchTerm.search_term));
    setHitCountSelection(hitCountsSelected.filter((SearchTerm_: any) => SearchTerm_.search_term !== SearchTerm.search_term));

    toParent && toParent({
      selected: hitCountsSelected,
      deleted: true,
      all: newhitsCountTableData
    })
  }

  var isFullSingle = (hitsCountItem: any) => Object.keys(hitsCountItem)
    .reduce((isfull, key) => hitsCountItem[key] === null ? false : isfull, true)


  var isFull = (hitsCountResponse: HitsCountResponse) => Boolean(hitsCountResponse.search_terms
    && hitsCountResponse.search_terms.length
    && hitsCountResponse.search_terms.length > 0
    && hitsCountResponse.search_terms.map(isFullSingle).every((isFull_: boolean) => isFull_))

  const clearTimeout_ = () => {
    timeout && clearTimeout(timeout);
    setTimeout_(undefined);
  }

  useEffect(() => {
    if (loading) return;
    setLoading(true);

    clearTimeout_();
    const try_ = () => pipe(
      then((fold(
        (err: Error) => console.log('errr', left(err)),
        (res: HitsCountResponse) => match(isFull(res))
          .with(false, () => {
            setLoading(false);
            const timeout_: any = setTimeout(() => setTimeout_(timeout_), 5000);
            setData(generateHitsCountTableData(right(res)))
            return;
          })
          .otherwise(() => {
            clearTimeout_();
            setPlatforms(generatePlatforms(res));
            setData(generateHitsCountTableData(right(res)))
          })
      )))
    )(Get<HitsCountResponse>('get_hits_count', { id: monitor_id }));

    try_();
    return () => clearTimeout_();
  }, [monitor_id, timeout]);

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
    <Table
      rowSelection={hitCountSelection}
      dataSource={hitsCountTableData}
      columns={platforms && createColumns(platforms, deleteSearchTerm)} />
  </div>
}