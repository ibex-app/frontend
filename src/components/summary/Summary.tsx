import { string } from "fp-ts";
import { Link } from "react-router-dom";
import { Get, Response, transform_filters_to_request } from "../../shared/Http";
import { BarChart } from "../charts/bar/BarChart";
import { ChartInputFilter, SummaryInputParams } from "../charts/chartInputFilter";
import { DoughnatChart } from "../charts/doughnat/DoughnatChart";
import { LineChart } from "../charts/line/LineChart";
import * as E from "fp-ts/lib/Either";
import { useState } from "react";
import classes from './Summary.module.css';

// export type downloadStatsParamsProps = {
//     monitorId: string,
//     axisX: string, 
//     axisY: string
// }

export function Summary({ filter, axisX, axisY }: SummaryInputParams) {
    const [fileLinkByPlatforms, setFileLinkByPlatforms] = useState<any>("");
    const [fileLinkByKeywords, setFileLinkByKeywords] = useState<any>("");
    const [fileLinkByAccounts, setFileLinkByAccounts] = useState<any>("");
    
    const [loading, setLoading] = useState(false);
    
    const generateLink = (fileLinkType: string) => {
        const fetchData = Get('download_posts_aggregated', {
            post_request_params: transform_filters_to_request(filter),
            axisX: axisX,
            axisY: axisY
          });
          
        fetchData.then((_data: Response<any>) => {
            setLoading(true);
            if (fileLinkType === "platforms") {
                let maybeData: any = E.getOrElse(() => fileLinkByPlatforms)(_data)
                if (!maybeData.file_location) {
                    return
                }
                else {
                    setLoading(false);
                    setFileLinkByPlatforms(maybeData)
                }
            }
            else if (fileLinkType === "keywords") {
                let maybeData: any = E.getOrElse(() => fileLinkByKeywords)(_data)
                if (!maybeData.file_location) {
                    return
                }
                else {
                    setLoading(false);
                    setFileLinkByKeywords(maybeData)
                }
            }
            else if (fileLinkType === "accounts"){
                let maybeData: any = E.getOrElse(() => fileLinkByAccounts)(_data)
                if (!maybeData.file_location) {
                    return
                }
                else {
                    setLoading(false);
                    setFileLinkByAccounts(maybeData)
                }
            }
        });
    }

    return <div className='results'>
        <div>
            Monitor name
            description
            dates
        </div>
        <div className='dashbord-block post'>
            <div>By Platforms</div>
            <LineChart axisX='platform' axisY='count' filter={filter} />
            <DoughnatChart axisX='platform' axisY='count' filter={filter} />
            <button onClick={() => generateLink("platforms")}>
                {
                    fileLinkByPlatforms ? "Download Link Generated" : "Generate Download Link"
                }
            </button>

            {
                fileLinkByPlatforms && !loading && <a className={classes.summaryDownloadLink} href={`${fileLinkByPlatforms?.file_location}`}>Download File</a>
            }
        </div>
        <div className='dashbord-block post'>
            <div>By keywords</div>
            <BarChart axisX='platform' axisY='count' filter={filter} />
            {/* <DoughnutChart  axisX={keyword} axisY={count}/> */}
            <button onClick={() => generateLink("keywords")}>
                {
                    fileLinkByKeywords ? "Download Link Generated" : "Generate Download Link"
                }
            </button>

            {
                fileLinkByKeywords && !loading && <a className={classes.summaryDownloadLink} href={`${fileLinkByKeywords?.file_location}`}>Download File</a>
            }
        </div>
        <div className='dashbord-block post'>
            <div>By Accounts</div>
            <LineChart axisX='platform' axisY='count' filter={filter} />
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button onClick={() => generateLink("accounts")}>
                {
                    fileLinkByAccounts ? "Download Link Generated" : "Generate Download Link"
                }
            </button>

            {
                fileLinkByAccounts && !loading && <a className={classes.summaryDownloadLink} href={`${fileLinkByAccounts?.file_location}`}>Download File</a>
            }
        </div>

        <div className='dashbord-block post'>
            <div>By Accounts</div>
            
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>
                Download
            </button>
        </div>

    </div>
}