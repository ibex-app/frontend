import { Collapse, Table } from "antd"
import { getOrElse } from "fp-ts/lib/Either";
import { useEffect, useState } from "react";
import { Get } from "../../shared/Http";

const { Panel } = Collapse;

type Input = {
  monitor_id: string;
}

export const Recommendations = ({ monitor_id }: Input) => {
  const [recommendations, setRecommendations] = useState<any>();

  useEffect(() => {
    Get('recommendations', { id: monitor_id }).then(data => setRecommendations(data));
  }, []);

  useEffect(() => {
    if (recommendations) {
      console.log(recommendations)
    }
  }, [recommendations]);

  return <Collapse style={{ margin: "0 5%" }}>
    <Panel header="Recommended keywords" key={1}>
      <Table />
      {/* { recommendations } */}
    </Panel>
  </Collapse>
}