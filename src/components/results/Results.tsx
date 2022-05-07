import { Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { Filter } from '../filter/Filter';
import { Table } from '../table/Table';
import { Header } from '../header/Header';
import { BarChart } from '../charts/bar/BarChart';
import { GraphChart } from '../charts/graph/GraphChart';
import { LineChart } from '../charts/line/LineChart';
import { MapChart } from '../charts/map/MapChart';
import { BubbleChart } from '../charts/bubble/BubbleChart';
import { Space } from "antd";

export function Results() {
  return (
    <Space>
      <Filter />
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="bar" element={<BarChart />} />
        <Route path="graph" element={<GraphChart />} />
        <Route path="line" element={<LineChart />} />
        <Route path="map" element={<MapChart />} />
        <Route path="bubble" element={<BubbleChart />} />
      </Routes>
    </Space>
  );
}
