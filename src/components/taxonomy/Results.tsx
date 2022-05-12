import * as E from "fp-ts/lib/Either";
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { Get, Response } from '../../shared/Http';
import { map } from "ramda";
import { Button, Col, Collapse, Input, List, Row, Space, Table } from "antd";
import { HitsCountItem, HitsCountResponse, HitsCountTable, HitsCountTableData, Monitor, MonitorRespose } from "../../types/taxonomy";
import { mapWithIndex } from "fp-ts/lib/Array";
import { hitCountCols } from "../../data/taxonomy/HitCounts";
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { PostType } from "../../types/common";
import { Post } from "../post/Post";
import { count } from "console";

const { Panel } = Collapse;

const formatNum = (num: number): string => {
  if (num < 10000) return num.toLocaleString()
  return Math.floor(num / 1000).toLocaleString() + 'K'
}

const generateHitsCountTableData = E.fold(
  () => [],
  mapWithIndex<HitsCountItem, HitsCountTableData>((key, { search_term, facebook, youtube, twitter }) => ({
    key: key.toString(),
    search_term,
    facebook: formatNum(facebook) || '0',
    youtube: formatNum(youtube) || '0',
    twitter: formatNum(twitter) || '0',
  }))
);

export const TaxonomyResults = () => {
  const { search } = useLocation();
  const [hitsCount, setHitsCount] = useState<HitsCountTable>({ columns: [], data: [] });
  const [monitor, setMonitor] = useState<Monitor>();
  const [posts, setPosts] = useState<Response<PostType[]>>(E.left(Error('Not fetched')));
  const [hitCountsSelected, setHitCountSelection] = useState<HitsCountTableData[]>([]);
  const [pagination, setPagination] = useState({ start_index: 0, count: 10 });

  const hitCountSelection = {
    hitCountsSelected,
    onChange: (_: React.Key[], selectedRows: any[]) => setHitCountSelection(selectedRows)
  }

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id'), [search]);

  const onLoadMore = () => setPagination({ start_index: pagination.count, count: 2 * pagination.count });

  const loadMore = <div
    style={{
      textAlign: 'center',
      marginTop: 12,
      height: 32,
      lineHeight: '32px',
      marginBottom: '20px'
    }}
  >
    <Button onClick={onLoadMore}>Load More...</Button>
  </div>

  useEffect(() => {
    Get<HitsCountResponse>('get_hits_count', { id: monitor_id }).then((data) => {
      setHitsCount({ columns: hitCountCols, data: generateHitsCountTableData(data) })
    });

    Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, ({ monitor }) => setMonitor(monitor)));
  }, [monitor_id]);

  useEffect(() => {
    Get<PostType[]>('posts', { monitor_id, ...pagination }).then(setPosts);
    window.dispatchEvent(new Event('resize'));
  }, [monitor_id, pagination]);

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
        {E.fold(
          () => <span>No posts to show</span>,
          (posts: PostType[]) =>
            <List dataSource={posts} style={{ paddingRight: "20px" }}
              loadMore={loadMore}
              renderItem={(item) => <Post post={item}
              />}
            ></List>
          // map((p: PostType) => <Post post={p} />)
        )(posts)}
      </Col>
    </Row>
  )
}

