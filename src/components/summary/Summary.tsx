import { Get, Response, transform_filters_to_request } from "../../shared/Http";
import { SummaryInputParams } from "../charts/chartInputFilter";
import { DoughnatChart } from "../charts/doughnat/DoughnatChart";
import { LineChart } from "../charts/line/LineChart";
import * as E from "fp-ts/lib/Either";
import { useState, useMemo, useEffect } from "react";
import { MonitorRespose } from '../../types/taxonomy';
import { MonitorBlock } from '../../components/monitor/Monitor';
import { useLocation } from 'react-router-dom';


export function Summary({ filter, axisX, axisY, setFilter }: SummaryInputParams) {
    const [fileLink, setFileLink] = useState<any>("");
    const [fileLinkByPlatforms, setFileLinkByPlatforms] = useState<any>("");
    const [fileLinkByKeywords, setFileLinkByKeywords] = useState<any>("");
    const [fileLinkByAccounts, setFileLinkByAccounts] = useState<any>("");

    const [platformLoading, setPlatformLoading] = useState(false);
    const [keywordLoading, setKeywordLoading] = useState(false);
    const [accountLoading, setAccountLoading] = useState(false);
    const [monitorData, setMonitorData] = useState<MonitorRespose>();

    const [platformLoadingText, setPlatformLoadingText] = useState("Download");
    const [keywordLoadingText, setKeywordLoadingText] = useState("Download");
    const [accountLoadingText, setAccountLoadingText] = useState("Download");
    const { search } = useLocation();
    const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);

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
                    setAccountLoadingText("Download");
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
                    setKeywordLoadingText("Download");
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
                    setPlatformLoadingText("Download");
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

    return <div className='results'>

        {monitorData ? <MonitorBlock monitorData={monitorData}></MonitorBlock> : 'Loading'}

        <div className='dashbord-block post'>
            <div>By Platforms</div>
            <LineChart type='line' axisX='platform' axisY='count' filter={filter} />
            <DoughnatChart axisX='platform' axisY='count' filter={filter} />

            <button onClick={() => generateDynamicLink('platform', 'count')}>
                {platformLoadingText}
            </button>
        </div>
        <div className='dashbord-block post'>
            <div>By keywords</div>
            {/* <BarChart axisX='platform' axisY='count' filter={filter} /> */}
            <LineChart type='bar' axisX='platform' axisY='count' filter={filter} />
            {/* <DoughnutChart  axisX={keyword} axisY={count}/> */}

            <button onClick={() => generateDynamicLink('keyword', 'count')}>
                {keywordLoadingText}
            </button>
        </div>
        <div className='dashbord-block post'>
            <div>By Accounts</div>
            <LineChart type='line' axisX='platform' axisY='count' filter={filter} />
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}

            <button onClick={() => generateDynamicLink('account', 'count')}>
                {accountLoadingText}
            </button>
        </div>

        <div className='dashbord-block post'>
            <div>All the posts</div>

            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>
                Download
            </button>
        </div>

    </div>
}