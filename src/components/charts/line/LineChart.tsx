import filterData from '../../../data/filter.json';
import { Typeahead } from 'react-bootstrap-typeahead';

import { useEffect, useMemo, useState } from 'react';

import { Https } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Line Chart',
    // },
    padding: {
      top: 5,
      left: 15,
      right: 15,
      bottom: 200
  }
  },
};


export function LineChart() {
// const BarChart = () => {
  var cols = [ "#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]

  let labels = [''];

  let data_: any = {
    labels,
    datasets: [
      {
        label: '',
        data: labels.map(() => 0)
      },
    ],
  };

    const [data, setData] = useState(data_);
    const [fetching, setFetching] = useState(false);
    
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
            "days": 7
         });
         
        fetchData.then(_data => {
          let maybeData:any  = E.getOrElse(() => [data_])(_data)
          if(!maybeData.length){
            return
          }

          var dateFrom: Date = new Date("2021-01-16T17:23:05.925Z");
          var dateTo:Date = new Date("2021-07-16T17:23:05.925Z");
          var interval: number = (dateTo.getTime() - dateFrom.getTime())
          var numberOfDays = Math.floor(interval / (24 * 60 * 60 * 1000));
          var numberOfWeeks = Math.ceil(numberOfDays / 7);
          
          // var firstJan = new Date(1900 + dateFrom.getYear(), 0, 1)
          var firstJan = new Date(2021, 0, 1)
          var daysThisYear = (dateFrom.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
          var startWeek = Math.ceil(daysThisYear/7)


          let intervals: any = ['']
          let post_label_values: [] = maybeData.map((i:any) => i[labelType].title).filter((v: any, i: any, a: any) => a.indexOf(v) === i)


          let datasets = post_label_values.map((i:any, index: number) => ({
            label: i,
            data: [0],
            borderColor: cols[index],
            backgroundColor: cols[index],
          }))
          labels = []
          // debugger
          for(let week = startWeek; week <= startWeek + numberOfWeeks; week++){
              var intervalDate = new Date(dateFrom);
              dateFrom.setDate(dateFrom.getDate() + week * 7);
              
              labels.push(intervalDate.toISOString().slice(0,10))
              
              datasets.forEach((dataset: any) => {
                let match = maybeData.find((d:any) => d[labelType].title == dataset.label && d._id.week == week)
                
                dataset.data.push(match ? match.count : 0)
              })
            }
            
            setData({
              labels,
              datasets: datasets,
            });
            setFetching(false)
        });

    }
    
    useEffect(() => fetchAndSet('topics'), []);

    if (fetching) {
        return (
            <div className="results" >Loading...</div>
        )
    }
    return (
        <div className="results">
            <select onChange={change}>
            {   ['topics', 'persons', 'locations', 'platforms', 'datasources'].map(d => <option key={d}>{d}</option> )     }

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
                <Line options={options} data={data} />
            </div>
                
        </div>
    );
}

// export default BarChart