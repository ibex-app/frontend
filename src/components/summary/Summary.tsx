import { Get, Response, transform_filters_to_request } from "../../shared/Http";
import { SummaryInputParams } from "../charts/chartInputFilter";
import { DoughnatChart } from "../charts/doughnat/DoughnatChart";
import { TimeSeriesChart } from "../charts/time-series/TimeSeriesChart";
import * as E from "fp-ts/lib/Either";
import { useState, useMemo, useEffect } from "react";
import { MonitorRespose } from '../../types/taxonomy';
import { MonitorBlock } from '../../components/monitor/Monitor';
import { useLocation } from 'react-router-dom';
import { Space, List, Row, Col } from "antd";
import { CloudDownloadOutlined } from '@ant-design/icons';

export function Summary({ filter, axisX, axisY, setFilter }: SummaryInputParams) {
    const [fileLink, setFileLink] = useState<any>("");
    const [downloading, setDownloading] = useState(false);
    const [timeInterval, setTimeinterval] = useState<number>();
    const [monitorData, setMonitorData] = useState<MonitorRespose>();

    const { search } = useLocation();
    const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

    const chertBlock = (title: string, axisX: string, axisY: string, type: 'doughnat' | 'bar') => <div className='dashbord-block post'>
        <div>
            <h1><div className="post-content">{title}</div></h1>
        </div>
        <TimeSeriesChart type='line' axisX={axisX} axisY={axisY} filter={filter} timeInterval={timeInterval}/>
        <DoughnatChart axisX={axisX} axisY={axisY} filter={filter} type={type} />
        <button disabled={downloading} onClick={() => getDownloadLink(axisX, axisY, timeInterval || 1)}><CloudDownloadOutlined key="summary" /> Download</button>
    </div>
    const getAllPosts = () => {
        setDownloading(true)
        const fetchData = Get('download_posts', {...transform_filters_to_request(filter)});

        fetchData.then((_data: Response<any>) => {
            let maybeData: any = E.getOrElse(() => setFileLink)(_data)
            if (!maybeData.file_location) return;
            setDownloading(false);
            window.location.href = maybeData?.file_location;
        });
    }

    const getDownloadLink = (axisX: string, axisY: string, timeInterval_:number) => {
        setDownloading(true)
        const fetchData = Get('download_posts_aggregated', {
            post_request_params: transform_filters_to_request(filter),
            axisX: axisX,
            axisY: axisY,
            days: timeInterval_
        });

        fetchData.then((_data: Response<any>) => {
            let maybeData: any = E.getOrElse(() => setFileLink)(_data)
            if (!maybeData.file_location) return;
            setDownloading(false);
            window.location.href = maybeData?.file_location;
        });
    }

    useEffect(() => {
        Get<MonitorRespose>('get_monitor', { id: monitor_id })
            .then(E.fold(console.error, setMonitorData));
    }, [monitor_id]);

    useEffect(() => {
        if (!monitorData) return
        filter.time_interval_from = filter.time_interval_from || new Date(monitorData.date_from)
        filter.time_interval_to = filter.time_interval_to
            ? filter.time_interval_to
            : monitorData?.date_to
                ? new Date(monitorData.date_to)
                : new Date()
        var dateFrom: any = new Date(filter.time_interval_from)
        var dateTo: any = new Date(filter.time_interval_to)
        const diffTime: number = Math.abs(dateFrom - dateTo);
        const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        let timeInterval: number = diffDays < 26 ? 1 : 7
        setTimeinterval(timeInterval)
        setFilter(filter)
    }, [monitorData]);

    return <List style={{ paddingRight: "20px" }} >


        {/* // <Space className="ant-space ant-space-vertical tax-mid mt-24"> */}

        {monitorData ? <MonitorBlock monitorData={monitorData}></MonitorBlock> : ''}
        {/* <Row className="post">
            <Col span={16}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <h1><div className="post-content">Platforms</div></h1>
                <TimeSeriesChart type='line' axisX='platform' axisY='count' filter={filter} />
            </Space>
            </Col>
            <Col span={4} >
                <DoughnatChart axisX='platform' axisY='count' filter={filter} />
            </Col>
            <button onClick={() => generateDynamicLink('platform', 'count')}>
                {platformLoadingText}
            </button>
        </Row> */
        }
        
        {chertBlock('Posts per Platform', 'platform', 'count', 'doughnat')}
        {chertBlock('Engagement per Platform', 'platform', 'total', 'doughnat')}
        {
            monitorData?.search_terms?.length ? <>
                {chertBlock('Posts per Search Term', 'search_term_ids', 'count', 'bar')}
                {chertBlock('Engagement per Search Term', 'search_term_ids', 'total', 'bar') } </> : ''
        }
        {
            monitorData?.accounts?.length ? <>
                {chertBlock('Posts per Account', 'account_id', 'count', 'bar')}
                {chertBlock('Engagement per Account', 'account_id', 'total', 'bar')}
                 </> : ''
        }

        <div className='dashbord-block post'>
            {/* <div>All the posts</div> */}

            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button disabled={downloading} onClick={getAllPosts}> <CloudDownloadOutlined key="summary" /> Full data Download </button>
        </div>
    </List>
}