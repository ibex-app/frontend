import { Collapse, Table } from "antd"
import { getOrElse } from "fp-ts/lib/Either";
import { useEffect } from "react";
import { Get } from "../../shared/Http";

const { Panel } = Collapse;

type Input = {
  monitor_id: string;
}

export const Recommendations = ({ monitor_id }: Input) => {
  useEffect(() => {
    Get('recomendations', { monitor_id }).then(data => console.log(data));
  }, []);

  return <Collapse style={{ margin: "0 5%" }}>
    <Panel header="Recommended keywords" key={1}>
      <Table />
    </Panel>
  </Collapse>
}