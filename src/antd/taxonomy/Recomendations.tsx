import { Collapse, Spin } from "antd"
import { useContext, useMemo, useState } from "react";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { drawFilterItem } from '../../shared/Utils/Taxonomy';
import { useRecommendationsState } from '../../state/useRecommendationsState';

const { Panel } = Collapse;

type Input = {
  monitor_id: string;
  toParent: Function
}

export const Recommendations = ({ monitor_id, toParent }: Input) => {
  const { setUserSelection } = useContext(TaxonomyContext);
  const { data } = useRecommendationsState(monitor_id);
  const [added, setAdded] = useState<string[]>([]);

  const recommendations = useMemo(() => data
    ? data?.recommendations?.filter((item) => !added.includes(item.word))
    : [], [data, added]);

  const AddRecommendation = (data: any) => {
    setAdded((prev) => [...prev, data.word]);
    setUserSelection(data.word)
    // toParent(data)
  }

  return <Collapse style={{ margin: "0 5%" }}>
    {/* { recommendations.map(( rec: any) => <div>{rec}</div>) } */}
    <Panel header="Recommended keywords" key={1}>
      {/* <Table /> */}
      {!data || data.is_loading
        ? <div> Loading  <Spin></Spin></div>
        : !!recommendations.length
          ? recommendations.map((rec: any) => <div className="recommend-row" key={rec.word}><div className="recommend-prog"><span style={{ height: (rec.score * 100) + "%" }}></span></div>
            <div className="recommend-word">
              {drawFilterItem({ title: rec.word })}
            </div> <button onClick={() => AddRecommendation(rec)}>Add </button></div>)
          : <div> No Data</div>
      }
    </Panel>
  </Collapse>
}