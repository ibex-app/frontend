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


export function Summary({ filter, axisX, axisY, setFilter }: SummaryInputParams) {
    const [fileLink, setFileLink] = useState<any>("");
    const [fileLinkByPlatforms, setFileLinkByPlatforms] = useState<any>("");
    const [fileLinkByKeywords, setFileLinkByKeywords] = useState<any>("");
    const [fileLinkByAccounts, setFileLinkByAccounts] = useState<any>("");

    const [platformLoading, setPlatformLoading] = useState(false);
    const [keywordLoading, setKeywordLoading] = useState(false);
    const [accountLoading, setAccountLoading] = useState(false);
    const [monitorData, setMonitorData] = useState<MonitorRespose>();

    const [platformLoadingText, setPlatformLoadingText] = useState("Download data aggregated by Platforms");
    const [keywordLoadingText, setKeywordLoadingText] = useState("Download data aggregated by Search Terms");
    const [accountLoadingText, setAccountLoadingText] = useState("Download data aggregated by Accounts");
    const { search } = useLocation();
    const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

    const chertBlock = (title: string, axisX: string, axisY: string, type: 'doughnat' | 'bar') => <div className='dashbord-block post'>
        <div>
            <h1><div className="post-content">{title}</div></h1>
        </div>
        <TimeSeriesChart type='line' axisX={axisX} axisY={axisY} filter={filter} />
        <DoughnatChart axisX={axisX} axisY={axisY} filter={filter} type={type} />
        <button onClick={() => generateDynamicLink(axisX, axisY)}>
            {platformLoadingText}
        </button>
    </div>

    const getDownloadLink = (axisX: string, axisY: string) => {
        const fetchData = Get('download_posts_aggregated', {
            post_request_params: transform_filters_to_request(filter),
            axisX: axisX,
            axisY: axisY
        });

        fetchData.then((_data: Response<any>) => {
            if (axisX === 'account') {
                let maybeData: any = E.getOrElse(() => fileLinkByAccounts)(_data)
                if (!maybeData.file_location) {
                    return;
                }
                else {
                    setAccountLoading(false);
                    setAccountLoadingText("Download data aggregated by Accounts");
                    setFileLinkByAccounts(maybeData?.file_location);
                    window.location.href = maybeData?.file_location;
                }
            }
            else if (axisX === 'keyword') {
                let maybeData: any = E.getOrElse(() => fileLinkByKeywords)(_data)
                if (!maybeData.file_location) {
                    return;
                }
                else {
                    setKeywordLoading(false);
                    setKeywordLoadingText("Download data aggregated by Search Terms");
                    setFileLinkByKeywords(maybeData?.file_location);
                    window.location.href = maybeData?.file_location;
                }
            }
            else if (axisX === 'platform') {
                let maybeData: any = E.getOrElse(() => fileLinkByPlatforms)(_data)
                if (!maybeData.file_location) {
                    return;
                }
                else {
                    setPlatformLoading(false);
                    setPlatformLoadingText("Download data aggregated by Platforms");
                    setFileLinkByPlatforms(maybeData?.file_location);
                    window.location.href = maybeData?.file_location;
                }
            }
        });
    }

    const generateDynamicLink = (axisX: string, axisY: string) => {
        if (axisX === 'platform') setPlatformLoadingText("Downloading...");
        else if (axisX === 'keyword') setKeywordLoadingText("Downloading...");
        else if (axisX === 'account') setAccountLoadingText("Downloading...")

        getDownloadLink(axisX, axisY);
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
        {/* {chertBlock('Posts per Platform', 'platform', 'count', 'doughnat')} */}
        {chertBlock('Engagement per Platform', 'platform', 'total', 'doughnat')}
        {
            monitorData?.search_terms?.length ? <>
                {chertBlock('Posts per Search Term', 'search_term_ids', 'count', 'bar')}
                {chertBlock('Engagement per Search Term', 'search_term_ids', 'total', 'bar')} </> : ''
        }
        {
            monitorData?.accounts?.length && false ? <>
                {chertBlock('Posts per Account', 'account_id', 'count', 'bar')}
                {chertBlock('Engagement per Account', 'account_id', 'total', 'bar')} </> : ''
        }

        <div className='dashbord-block post'>
            {/* <div>All the posts</div> */}

            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>
                Full data Download
            </button>
        </div>
    </List>
}