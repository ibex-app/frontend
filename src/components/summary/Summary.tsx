import { BarChart } from "../charts/bar/BarChart";
import { ChartInputFilter } from "../charts/chartInputFilter";
import { DoughnatChart } from "../charts/doughnat/DoughnatChart";
import { LineChart } from "../charts/line/LineChart";

export function Summary( { filter }: ChartInputFilter) {
    console.log(filter)
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
            <button>Download</button>
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