import { useEffect, useMemo, useState } from 'react';

import { Get, Response, transform_filters_to_request } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";
import Spinner from '../../../antd/Spinner/Spinner';

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
import { Line, Bar  } from 'react-chartjs-2';
import { ChartInputParams } from '../chartInputFilter';
import {getCol} from '../doughnat/DoughnatChart'

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
  maintainAspectRatio: false,
  type: 'line',
  responsive: true,
  plugins: {
    filler: {
      propagate: false,
    },
    legend: {
      position: 'top' as const,
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
      stacked: false,
      title: {
        display: true,
        text: 'Week'
      }
    },
    y: {
      // display: true,
      stacked: false,
      title: {
        display: true,
        text: 'Count'
      }
    }
  }
};



export function TimeSeriesChart({ axisX, axisY, filter, type, timeInterval}: ChartInputParams) {
  useEffect(() => {
    if (!filter.time_interval_from || !filter.time_interval_to || !timeInterval) return
    if (Object.keys(filter).length) loadData();
  }, [filter]);

  const [fetching, setFetching] = useState(false);
  const [noData, setNoData] = useState(false);
  
  
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



  const generate_dataset = (responce_data: any, labelType: string, filters: any) => {

    var dateFrom: Date = new Date(filters.time_interval_from)
    var dateTo: Date = new Date(filters.time_interval_to)
    // console.log('generate_dataset timeInterval', timeInterval)
    // dateTo.setDate(dateTo.getDate() + ((timeInterval || 1)*2));
    // dateFrom.setDate(dateFrom.getDate() + (timeInterval || 1));

    var interval: number = (dateTo.getTime() - dateFrom.getTime())
    var numberOfDays = Math.floor(interval / (24 * 60 * 60 * 1000));
    var numberOfWeeks = Math.ceil(numberOfDays / 7);
    
    if (type == 'bar') {
      options.scales.x.stacked = true
      options.scales.y.stacked = true
    }

    var firstJan = new Date(2022, 0, 1)
    var daysThisYear = (dateFrom.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
    var startTime = timeInterval == 7 ? Math.ceil(daysThisYear / 7) : Math.ceil(daysThisYear)
    var endTime = startTime + (timeInterval == 7 ? numberOfWeeks : numberOfDays)

    responce_data.forEach((dataPoint:any) => dataPoint.label = dataPoint.label || dataPoint.title || dataPoint.term || (dataPoint.platform  + '_' + dataPoint.account_title))
    
    const max_values: any = {}
    if(axisY == 'total' && (axisX == 'platform' || axisX == 'account' || axisX == 'language')){
      responce_data.forEach((i:any) => {
          max_values[i.label] = max_values[i.label] > i.count ? max_values[i.label] : i.count
      })
    }

    let post_label_values: [] = responce_data.map((dataPoint: any) => ({label: dataPoint.label, platform: dataPoint.platform}))
                                             .filter((value:any, index:number, self: any) =>
                                             index === self.findIndex((t: any) => (
                                               t.label === value.label && t.platform === value.platform
                                             ))
                                           )
    let datasets = type == 'line' 
      ? post_label_values.map((label: any, index: number) => ({
          label: label.label,
          data: [],
          borderColor:  getCol(label, index),
          lineTension: .35,
          radius: 4  
        }))
      : post_label_values.map((label: any, index: number) => ({
        label: label.label,
        data: [],
        backgroundColor: getCol(label, index),
        fill: true,
        pointBackgroundColor: 'rgba(0,0,0,.3)',
        borderColor: 'rgba(0,0,0,0)',
        lineTension: .35,
        radius: 4
      }))
    labels = []
    
    
    for (var timeAt = startTime; timeAt <= endTime; timeAt++) {
      var intervalDate = new Date(firstJan);
      intervalDate.setDate(intervalDate.getDate() + (timeAt * (timeInterval || 1)));
      labels.push(intervalDate.toISOString().slice(0, 10))
      
      datasets.forEach((dataset: any) => {
        let match = responce_data.filter((dataPoint: any) => dataPoint.label == dataset.label && dataPoint[timeInterval == 7 ? 'week' :'day'] == timeAt)
        if(!match.length){
          // console.log(111, dataset.label, timeAt, match)
          dataset.data.push(0)
        } else if (labelType == 'platform' || labelType == 'search_term_ids'  || labelType == 'account_id' || axisX == 'language'){
          let count = match.reduce((a: any, b: any) => a += b.count, 0)
          let val = axisY == 'total' && (axisX == 'platform' || axisX == 'account' || axisX == 'language') ? max_values[dataset.label]/count : count
          // let val = count
          dataset.data.push(val)
        } else {
          dataset.data.push(match.length)
        }
      })
    }
    
    console.log(datasets)
    return {
      labels,
      datasets: datasets,
    }
  }

  const loadData = () => {
    if(!timeInterval) return
    setFetching(true)
    setNoData(false)

    const fetchData = Get('posts_aggregated', {
      post_request_params: transform_filters_to_request(filter),
      axisX: axisX,
      axisY: axisY,
      days: timeInterval
    });


    fetchData.then((_data: Response<any>) => {
      let maybeData: any = E.getOrElse(() => [data_])(_data)
      if (!maybeData.length) {
        setFetching(false)
        setNoData(true)
        return
      }

      let dataset_and_labels: any = generate_dataset(maybeData, axisX, filter)
      setData(dataset_and_labels);
      setFetching(false)
    });
  }

 
  return (
    <div className="chart-cont-l">
      {
        fetching 
          ? <div className="button-tr"><div><div className="chart-loadding">Loading the chart...<Spinner /></div></div></div>
          : noData 
            ? <div className="button-tr"><div><div className="chart-loadding">No Posts</div></div></div>
            :<div className="chart">
              { type == 'line' 
                ? <Line options={options} data={data} />
                : <Bar options={options} data={data} /> }
           </div>
      }
    </div>
  );
}