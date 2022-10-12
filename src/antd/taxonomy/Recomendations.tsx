import { Collapse, Table, Spin } from "antd"
import { getOrElse } from "fp-ts/lib/Either";
import { useEffect, useState, useContext } from "react";
import { Get } from "../../shared/Http";
import { fold, left, right } from "fp-ts/lib/Either";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";
import { useRecommendationsState } from '../../state/useRecommendationsState';

const { Panel } = Collapse;

type Input = {
  monitor_id: string;
  toParent: Function
}

export const Recommendations = ({ monitor_id, toParent }: Input) => {
  const { setUserSelection } = useContext(TaxonomyContext);
  const { data: recommendations } = useRecommendationsState(monitor_id);

  const AddRecommendation = (data: any) => {
    setUserSelection(data.word)
    // toParent(data)
  }

  return <Collapse style={{ margin: "0 5%" }}>
    {/* { recommendations.map(( rec: any) => <div>{rec}</div>) } */}
    <Panel header="Recommended keywords" key={1}>
      {/* <Table /> */}
      { !recommendations || recommendations.is_loading
          ? <div> Loading  <Spin></Spin></div>
          : recommendations?.recommendations?.length
            ? recommendations?.recommendations.map((rec: any) => <div className="recommend-row"><div className="recommend-prog"><span style={{ height: (rec.score * 100) + "%" }}></span></div>
              <div className="recommend-word">{rec.word}</div> <button onClick={() => AddRecommendation(rec)}>Add </button></div>)
            : <div> No Data</div>  
          }
    </Panel>
  </Collapse>
}