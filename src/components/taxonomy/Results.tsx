import * as E from "fp-ts/lib/Either";
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { Get } from '../../shared/Http';
import { map } from "ramda";
import { Col, Collapse, Row, Space, Table } from "antd";
import { Monitor, MonitorRespose } from "../../types/taxonomy";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { Posts } from "../../antd/Posts";
import { HitsCount, HitsCountOutput } from "../../antd/taxonomy/HitsCount";

const { Panel } = Collapse;

export const TaxonomyResults = () => {
  const { search } = useLocation();
  const [monitor, setMonitor] = useState<Monitor>();
  const [hitsCount, setHitsCount] = useState<HitsCountOutput>();

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

  useEffect(() => {
    Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, ({ monitor }) => setMonitor(monitor)));
  }, [monitor_id]);

  return (
    <Row>
      <Col span={8}>
        <Space direction="vertical" style={{ display: "flex" }}>
          <div className="leftbox-title"> <span>{monitor?.title}</span> <FontAwesomeIcon icon={faSliders} /></div>
          <HitsCount monitor_id={monitor_id} toParent={setHitsCount} />
          <Collapse style={{ margin: "0 5%" }}>
            <Panel header="Recommended keywords" key={1}>
              <Table />
            </Panel>
          </Collapse>
        </Space>
      </Col>
      <Col span={16} style={{ color: "#F4F4F5" }}>
        {hitsCount?.selected.length && <Space className="flex search-header">
          Search results for {map(drawFilterItem, hitsCount.selected)}
        </Space>}
        <Posts filter={{ monitor_id }} />
      </Col>
    </Row>
  )
}

