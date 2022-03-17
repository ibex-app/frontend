import filterData from '../../../data/filter.json';
import { Typeahead } from 'react-bootstrap-typeahead';

import { useEffect, useMemo, useState } from 'react';
import { useGlobalState } from '../../../app/store';

import { get, Response, transform_filters_to_request } from '../../../shared/Http';
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
  Filler
} from 'chart.js';
import { Line, Bar} from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(Filler);

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
  type: 'line',
  responsive: true,
  plugins: {
    filler: {
      propagate: false,
    },
    legend: {
      position: 'right' as const,
    },
    // title: {
    //   display: true,
    //   text: 'Chart.js Line Chart',
    // },
    padding: {
      top: 25,
      left: 15,
      right: 15,
      bottom: 200
    },
  },
  scales: {
    x: {
      // display: true,
      stacked: true,
      title: {
        display: true,
        text: 'Week'
      }
    },
    y: {
      // display: true,
      stacked: true,
      title: {
        display: true,
        text: 'Count'
      }
    }
  }
};


export function BarChart() {
  const [filters, _]: any = useGlobalState('filters');
  useEffect(() => {
    if (Object.keys(filters).length) loadData('persons');
  }, [filters]);

  const [fetching, setFetching] = useState(false);

  var cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]

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

  const change = (e: any) => {
    loadData(e.target.value)
  }

  const generate_dataset = (responce_data: any, labelType: string, filters: any) => {
    // console.log(filters)
    var dateFrom: Date = new Date(filters.time_interval_from)
    var dateTo: Date = new Date(filters.time_interval_to)
    dateTo.setDate(dateTo.getDate()+7);

    var interval: number = (dateTo.getTime() - dateFrom.getTime())
    var numberOfDays = Math.floor(interval / (24 * 60 * 60 * 1000));
    var numberOfWeeks = Math.ceil(numberOfDays / 7);

    // var firstJan = new Date(1900 + dateFrom.getYear(), 0, 1)
    var firstJan = new Date(2022, 0, 1)
    var daysThisYear = (dateFrom.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
    var startWeek = Math.ceil(daysThisYear / 7)

    responce_data.forEach((i:any) => {
      if(!i[labelType].title){
        i[labelType].title = i[labelType].label
      }
    })

    let post_label_values: [] = responce_data.map((i: any) => i[labelType].title).filter((v: any, i: any, a: any) => a.indexOf(v) === i)

    console.log('post_label_values', post_label_values)

    let datasets = post_label_values.map((label: any, index: number) => ({
      label: label,
      data: [0],
      backgroundColor: cols[index],
      fill: true,
      pointBackgroundColor: 'rgba(0,0,0,.3)',
      borderColor: 'rgba(0,0,0,0)',
      lineTension: .35,        
      radius: 4  
    }))
    labels = []

    for (let week = startWeek; week <= startWeek + numberOfWeeks; week++) {
      var intervalDate = new Date(dateFrom);
      dateFrom.setDate(dateFrom.getDate() + week * 7);

      labels.push(intervalDate.toISOString().slice(0, 10))

      datasets.forEach((dataset: any) => {
        let match = responce_data.filter((d: any) => d[labelType].title == dataset.label && d._id.week == week)
        if(!match.length){
          dataset.data.push(0)
        } else if (labelType == 'platform'){
          let count = match.reduce((a: any, b: any) => a += b.count, 0)
          dataset.data.push(count)
        } else {
          dataset.data.push(match.length)
        }
      })
    }

    return {
      labels,
      datasets: datasets,
    }
  }

  const loadData = (labelType: string) => {
    setFetching(true)
    const fetchData = get('posts_aggregated', {
      post_request_params: transform_filters_to_request(filters),
      axisX: labelType,
      days: 7
    });


    fetchData.then((_data: Response<any>) => {
      let maybeData: any = E.getOrElse(() => [data_])(_data)
      if (!maybeData.length) {
        return
      }

      let dataset_and_labels: any = generate_dataset(maybeData, labelType, filters)
      setData(dataset_and_labels);
      setFetching(false)
      console.log(dataset_and_labels)
    });

  }

  if (fetching) {
    return (
      <div className="results" >Loading...</div>
    )
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
  );
}

// export default BarChart


// 52 + 35 + 11 + 9  = 107