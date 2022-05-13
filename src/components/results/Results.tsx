import { Routes, Route, useLocation } from "react-router-dom";

import { Filter } from '../filter/Filter';
import { Table } from '../table/Table';
import { BarChart } from '../charts/bar/BarChart';
import { GraphChart } from '../charts/graph/GraphChart';
import { LineChart } from '../charts/line/LineChart';
import { MapChart } from '../charts/map/MapChart';
import { BubbleChart } from '../charts/bubble/BubbleChart';
import { Space } from "antd";
import { useMemo, useState } from "react";
import { Posts } from "../../antd/Posts";

export function Results() {
  const { search } = useLocation();
  const [filter, setFilter] = useState({});
  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

  return (
    <Space direction="vertical">
      <Filter onChange={setFilter} />
      <Routes>
        <Route path="/" element={<Posts filter={{ ...filter, monitor_id }} />} />
        <Route path="bar" element={<BarChart />} />
        <Route path="graph" element={<GraphChart />} />
        <Route path="line" element={<LineChart />} />
        <Route path="map" element={<MapChart />} />
        <Route path="bubble" element={<BubbleChart />} />
      </Routes>
    </Space>
  );
}
