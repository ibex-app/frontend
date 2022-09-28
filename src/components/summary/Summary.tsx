import { string } from "fp-ts";
import { Link } from "react-router-dom";
import { BarChart } from "../charts/bar/BarChart";
import { ChartInputFilter } from "../charts/chartInputFilter";
import { DoughnatChart } from "../charts/doughnat/DoughnatChart";
import { LineChart } from "../charts/line/LineChart";

export type downloadStatsParamsProps = {
    monitorId: string,
    axisX: string, 
    axisY: string
}

export function Summary({ filter, monitorId = '' }: ChartInputFilter) {
    // generate each download button link
    // const generateLink = ({monitorId, axisX, axisY}: downloadStatsParamsProps) => {
    //     return  <a href={`https://static.ibex-app.com/${monitorId}_${axisX}_${axisY}.csv`}>Download</a>
    // }

    const platformsProps: downloadStatsParamsProps  = {
        monitorId: monitorId,
        axisX: 'platform',
        axisY: 'count',
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
            <button>
                <a 
                    href={`https://static.ibex-app.com/
                    ${platformsProps.monitorId}_
                    ${platformsProps.axisX}_
                    ${platformsProps.axisY}.csv`}
                >
                    Download
                </a>
            </button>
        </div>
        <div className='dashbord-block post'>
            <div>By keywords</div>
            <BarChart axisX='platform' axisY='count' filter={filter} />
            {/* <DoughnutChart  axisX={keyword} axisY={count}/> */}
            <button>Download</button>
        </div>
        <div className='dashbord-block post'>
            <div>By Accounts</div>
            <LineChart axisX='platform' axisY='count' filter={filter} />
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>Download</button>
        </div>

        <div className='dashbord-block post'>
            <div>By Accounts</div>
            
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>Download</button>
        </div>

    </div>
}