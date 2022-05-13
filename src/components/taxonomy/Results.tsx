import * as E from "fp-ts/lib/Either";
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { Get, Response } from '../../shared/Http';
import { map } from "ramda";
import { Button, Col, Collapse, Input, Row, Space, Table } from "antd";
import { HitsCountResponse, HitsCountTable, HitsCountTableData, Monitor, MonitorRespose } from "../../types/taxonomy";
import { hitCountCols } from "../../data/taxonomy/HitCounts";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { PostType } from "../../types/common";
import { generateHitsCountTableData } from "./Data";
import { Posts } from "../../antd/Posts";

const { Panel } = Collapse;

export const TaxonomyResults = () => {
  const { search } = useLocation();
  const [hitsCount, setHitsCount] = useState<HitsCountTable>({ columns: [], data: [] });
  const [monitor, setMonitor] = useState<Monitor>();
  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountTableData[]>([]);

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

  const hitCountSelection = {
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }

  useEffect(() => {
    Get<HitsCountResponse>('get_hits_count', { id: monitor_id }).then((data) => {
      setHitsCount({ columns: hitCountCols, data: generateHitsCountTableData(data) })
    });

    Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, ({ monitor }) => setMonitor(monitor)));
  }, [monitor_id]);

  return (
    <Row>
      <Col span={8}>
        <Space direction="vertical" style={{ display: "flex" }}>
          <div className="leftbox-title"> <span>{monitor?.title}</span> <FontAwesomeIcon icon={faSliders} /></div>
          <div className="leftbox-inner">
            <Space size="small">
              <Input placeholder="Search in your list" prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
              <Button>Add</Button>
            </Space>
            <Table rowSelection={hitCountSelection} columns={hitsCount.columns} dataSource={hitsCount.data} />
          </div>
          <Collapse style={{ margin: "0 5%" }}>
            <Panel header="Recommended keywords" key={1}>
              <Table />
            </Panel>
          </Collapse>
        </Space>
      </Col>
      <Col span={16} style={{ color: "#F4F4F5" }}>
        {hitCountsSelected.length && <Space className="flex search-header">
          Search results for {map(drawFilterItem, hitCountsSelected)}
        </Space>}
        <Posts filter={{ monitor_id }} />
      </Col>
    </Row>
  )
}

