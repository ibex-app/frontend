export function Summary() {
    return <div>
        <div>
            Monitor name
            description
            dates
        </div>
        <div>
            By Platforms
            {/* <LineChart axisX={platform} axisY={count} /> */}
            {/* {<DoughnutChart axisX={platform} axisY={count} />} */} https://react-chartjs-2.js.org/examples/doughnut-chart/
            <button>Download</button>
        </div>
        <div>
            By keywords
            {/* <LineChart axisX={keyword} axisY={count}/> */}
            {/* <DoughnutChart  axisX={keyword} axisY={count}/> */}
            <button>Download</button>
        </div>
        <div>
            By Accounts
            {/* <LineChart axisX={account} axisY={count}/> */}
            {/* <DoughnutChart  axisX={account} axisY={count}/> */}
            <button>Download</button>
        </div>

    </div>
}