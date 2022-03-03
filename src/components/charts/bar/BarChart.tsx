import filterData from '../../../data/filter.json';
import { Typeahead } from 'react-bootstrap-typeahead';

import { useEffect, useMemo, useState } from 'react';

import { get, transform_filters_to_request } from '../../../shared/Http';
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
    const [data, setData]: any = useState([]);
    const [fetching, setFetching]: any = useState(true);
    const [filters, _]: any = useGlobalState('filters');
    
    useEffect(() => {
        if (Object.keys(filters).length) loadData('persons');
    }, [filters]);
    
    // useEffect(() => fetchAndSet('topics'), []);

    // const BarChart = () => {
    var cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]
    let labels = [0]
    let data_: any = {
        labels,
        datasets: [
            {
                label: 'Locations',
                data: [0],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const change = (e: any) => {
        loadData(e.target.value)
    }

    const loadData = (labelType: string) => {
        setFetching(true)

        const fetchData = get('posts_aggregated', {
            post_request_params: transform_filters_to_request(filters),
            axisX: labelType
        });
       

        fetchData.then(_data => {
            let pre_data: any = { count: 0 }
            pre_data[labelType] = { title: 0 }

            let maybeData = E.getOrElse(() => [pre_data])(_data)
            
            let labels = maybeData.map(i => i[labelType].title || i[labelType])
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

            console.log(data_);
        })
    }
   
    
    return ( 
        <div className="results">
            <select onChange={change}>
                {['persons', 'locations', 'platform', 'topics', 'datasources'].map(d => <option key={d}>{d}</option>)}
            </select>
            <select onChange={change}>
                {['count', 'hate-speech', 'reach-out', 'likes', 'shares', 'sentiment', 'comments'].map(d => <option key={d}>{d}</option>)}
            </select>
            {
                fetching ? (
                    <div className="button-tr"><div><div className="round-btn-transp">Loading...</div></div></div>
                ) : (<div className="chart"><Bar options={options} data={data} /></div>)
                // ) : (<div className="chart"></div>)
            }
        </div>
    ) 
}
 /* <Typeahead
                // multiple
                id="Axis-X"
                onChange={change}
                options={filterData.data.map(d => d.label)}
                placeholder="Axis X"
            // selected={value}
            /> */
// export default BarChart