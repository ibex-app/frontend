import { Routes, Route, useLocation } from "react-router-dom";

import { Filter } from '../filter/Filter';
import { GraphChart } from '../charts/graph/GraphChart';
import { MapChart } from '../charts/map/MapChart';
import { BubbleChart } from '../charts/bubble/BubbleChart';
import { Space } from "antd";
import { useMemo, useState } from "react";
import { Posts } from "../../antd/Posts";
import { Sidebar } from '../sidebar/Sidebar';
import { Col, Row } from "antd";
import FilterData from '../../data/filter.json';
import { Summary } from "../summary/Summary";
import { useMonitorState } from '../../state/useMonitorState';
import { length } from 'ramda';
import { drawFilterItem } from '../../shared/Utils/Taxonomy';

export function Results() {
  const { search } = useLocation();
  const [filter, setFilter] = useState({});
  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);
  const filters = useMemo(() => ({ ...filter, monitor_id }), [filter, monitor_id]);

  const { data: monitor, isLoading: monitorLoading } = useMonitorState(monitor_id);

  const externalFilterData: any = useMemo(() => FilterData.data, []);

  const filterData = useMemo(() => {
    const temp = [...externalFilterData];

    if (!monitor) return [];

    length(monitor.platforms) && temp.push({
      "id": "platform",
      "type": "tag",
      "title": "Platform",
      "value": [],
      "list": monitor.platforms.map(platform => ({ "id": platform, "label": platform }))
    });

    length(monitor.search_terms) && temp.push({
      "id": "search_terms",
      "type": "tag",
      "title": "Search Terms",
      "value": [],
      "list": monitor.search_terms.map(({ id, term }) => ({ "id": id, "label": term, render: drawFilterItem({ title: term }) }))
    })

    length(monitor.accounts) && temp.push({
      id: "account_ids",
      type: "tag",
      title: "Accounts",
      value: [],
      list: monitor.accounts.map(({ id, platform, title }: any) => ({ id, platform, label: title }))
    });

    return temp;
  }, [monitor?.accounts])

  return (
    <>
    <Sidebar />
    <Row >
      <Col span={24} className="results-cont">
      {!monitorLoading && <Filter data={filterData} onChange={setFilter} />}
      </Col>
    </Row>
    <Row align="middle">
      <Col span={18} offset={3} className="results-cont mt-80">
        {/* <Space direction="vertical" className="ant-space ant-space-vertical tax-mid mt-20" > */}
          <Routes>
            <Route path="/" element={<Posts filter={filters} allowRedirect />} />
            {/* <Route path="bar" element={<BarChart filter={filters} />} /> */}
            <Route path="graph" element={<GraphChart />} />
            {/* <Route path="line" element={<TimeSeriesChart filter={filters} />} /> */}
            <Route path="map" element={<MapChart filter={filters} />} />
            <Route path="bubble" element={<BubbleChart />} />
            <Route path="summary" element={<Summary setFilter={setFilter} filter={filters} axisX="platform" axisY="count" />} />
          </Routes>
        {/* </Space> */}
      </Col>
    </Row>
    </>
  );
}
