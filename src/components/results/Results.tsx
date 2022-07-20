import { Routes, Route, useLocation } from "react-router-dom";

import { Filter } from '../filter/Filter';
import { BarChart } from '../charts/bar/BarChart';
import { GraphChart } from '../charts/graph/GraphChart';
import { LineChart } from '../charts/line/LineChart';
import { MapChart } from '../charts/map/MapChart';
import { BubbleChart } from '../charts/bubble/BubbleChart';
import { Space } from "antd";
import { useMemo, useState } from "react";
import { Posts } from "../../antd/Posts";
import { Sidebar } from '../sidebar/Sidebar';
import { Col, Row } from "antd";
import FilterData from '../../data/filter.json';

export function Results() {
  const { search } = useLocation();
  const [filter, setFilter] = useState({});
  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);
  const filters = { ...filter, monitor_id };

  return (
    <Row >
      <Col span={3} style={{ height: "100vh", position: "sticky", top: "0" }}>
        <Sidebar />
      </Col>
      <Col span={21}>
        <Space direction="vertical">
          <Filter data={FilterData.data} onChange={setFilter} />
          <Routes>
            <Route path="/" element={<Posts filter={filters} allowRedirect />} />
            <Route path="bar" element={<BarChart filter={filters} />} />
            <Route path="graph" element={<GraphChart />} />
            <Route path="line" element={<LineChart filter={filters} />} />
            <Route path="map" element={<MapChart filter={filters} />} />
            <Route path="bubble" element={<BubbleChart />} />
          </Routes>
        </Space>
      </Col>
    </Row>
  );
}
