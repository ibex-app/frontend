import { BarChart } from "../charts/bar/BarChart";
import { ChartInputFilter } from "../charts/chartInputFilter";
import { DoughnatChart } from "../charts/doughnat/DoughnatChart";
import { LineChart } from "../charts/line/LineChart";

export function Summary( { filter }: ChartInputFilter) {
    console.log(filter)
    return <div>
        <div>
            Monitor name
            description
            dates
        </div>
        <div>
            By Platforms
            <LineChart axisX='platform' axisY={10} filter={filter} />
            {/* <BarChart axisX="platform" filter={filter} /> */}
            {/* <DoughnutChart axisX={platform} axisY={count} /> https://react-chartjs-2.js.org/examples/doughnut-chart/ */}
            <button>Download</button>
        </div>
        <div>
            By keywords
            <BarChart axisX='platform' axisY={11} filter={filter} />
            {/* <DoughnutChart  axisX={keyword} axisY={count}/> */}
            <button>Download</button>
        </div>
        <div>
            By Accounts
            <LineChart axisX='platform' axisY={12} filter={filter} />
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>Download</button>
        </div>

        <div>
            By Accounts
            <DoughnatChart axisX='platform' axisY={12} filter={filter} />
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>Download</button>
        </div>

    </div>
}