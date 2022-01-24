import filterData from '../../../data/filter.json';
import { Typeahead } from 'react-bootstrap-typeahead';

import { useEffect, useMemo, useState } from 'react';

import { Https } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useGlobalState } from '../../../app/store';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
        legend: {
            // position: 'right' as const,
            display: false
        },
    },
    layout: {
        padding: {
            top: 5,
            left: 15,
            right: 15,
            bottom: 200
        }
    }
};


export function BarChart() {

    const [filters, setFilters] = useGlobalState('filters');
    useEffect(() => {
        console.log(filters);
    }, [filters]);

    // const BarChart = () => {
    var cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]
    let labels = [0]
    let data_: any = {
        labels,
        datasets: [
            {
                label: 'Topics',
                data: [0],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const [data, setData] = useState(data_);
    const [fetching, setFetching] = useState(true);

    const change = (e: any) => {
        setFetching(true)
        fetchAndSet(e.target.value)
    }

    const fetchAndSet = (labelType: string) => {
        const fetchData = Https.get('posts_aggregated', {
            "post_request_params": {
                "time_interval_from": "2021-01-16T17:23:05.925Z",
                "time_interval_to": "2021-07-16T17:23:05.925Z",
            },
            "axisX": labelType,
            // "days": 30
        });

        fetchData.then(_data => {
            let pre_data: any = { count: 0 }
            pre_data[labelType] = { title: 0 }
            let maybeData = E.getOrElse(() => [pre_data])(_data)
            let labels = maybeData.map(i => i[labelType].title)
            data_ = {
                labels,
                datasets: [
                    {
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: '#8d639a',
                        pointBorderColor: '#111',
                        pointBackgroundColor: '#ff4000',
                        pointBorderWidth: 2,
                        label: labelType,
                        data: maybeData.map(i => i.count),
                    },
                ],
            };
            setData(data_);
            setFetching(false)
        });

    }

    useEffect(() => fetchAndSet('topics'), []);

    if (fetching) {
        return (
            <div className="results">Loading...</div>
        )
    }
    return (
        <div className="results">
            <select onChange={change}>
                {['topics', 'persons', 'locations', 'platforms', 'datasources'].map(d => <option key={d}>{d}</option>)}
            </select>
            <select onChange={change}>
                {['hate-speech', 'count', 'reach-out', 'likes', 'shares', 'sentiment', 'comments'].map(d => <option key={d}>{d}</option>)}
            </select>

            {/* <Typeahead
                // multiple
                id="Axis-X"
                onChange={change}
                options={filterData.data.map(d => d.label)}
                placeholder="Axis X"
            // selected={value}
            /> */}
            <div className="chart">
                <Bar options={options} data={data} />
            </div>

        </div>
    );
}

// export default BarChart