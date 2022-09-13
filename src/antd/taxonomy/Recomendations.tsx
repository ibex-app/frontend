import { Collapse, Table } from "antd"
import { getOrElse } from "fp-ts/lib/Either";
import { useEffect, useState, useContext } from "react";
import { Get } from "../../shared/Http";
import { fold, left, right } from "fp-ts/lib/Either";
import { TaxonomyContext } from "../../components/taxonomy/TaxonomyContext";

const { Panel } = Collapse;

type Input = {
  monitor_id: string;
  toParent: Function
}

export const Recommendations = ({ monitor_id, toParent }: Input) => {
  const { setUserSelection } = useContext(TaxonomyContext);
  const [recommendations, setRecommendations] = useState<any>();

  const setRecommendations_ = (rec: any) => {
    if (rec) {
      let rec_: any = right(rec)
      setRecommendations(rec_.right.right)
    }
  }

  useEffect(() => {
    Get('recommendations', { id: monitor_id })
      .then(data => setRecommendations_(data));
  }, []);

  
  const AddRecommendation = (data:any) => {
    console.log(data)
    setUserSelection(data.word)
    // toParent(data)
  }

  return <Collapse style={{ margin: "0 5%" }}>
    {/* { recommendations.map(( rec: any) => <div>{rec}</div>) } */}
    <Panel header="Recommended keywords" key={1}>
      {/* <Table /> */}
      { !recommendations 
          ? <div> No Data</div>
          : recommendations.map(( rec: any) => <div className="recommend-row"><div className="recommend-prog"><span style={{ height: (rec.score*100)+"%" }}></span></div> 
          <div className="recommend-word">{rec.word}</div> <button onClick={() => AddRecommendation(rec)}>Add </button></div>) }
    </Panel>
  </Collapse>
}