import { useEffect, useState } from 'react';
import { Get, Response, transform_filters_to_request } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";
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
import { Bar } from 'react-chartjs-2';
import { ChartInputFilter, ChartInputParams } from '../chartInputFilter'

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


export function BarChart({ axisX, axisY, filter }: ChartInputParams) {
  useEffect(() => {
    if (!filter.time_interval_from || !filter.time_interval_to) return
    if (Object.keys(filter).length) loadData();
  }, [filter]);

  const [fetching, setFetching] = useState(false);
  const exactCols:any = {
    facebook: '#2e89ff',
    youtube: '#f10000',
    twitter: '#51a3e3'
  }
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
  const [timeInterval, setTimeInterval] = useState(1);


  const generate_dataset = (responce_data: any, labelType: string, filters: any) => {
    var dateFrom: Date = new Date(filters.time_interval_from)
    var dateTo: Date = new Date(filters.time_interval_to)
    dateTo.setDate(dateTo.getDate() + timeInterval*3);
    dateFrom.setDate(dateFrom.getDate() - timeInterval);

    var interval: number = (dateTo.getTime() - dateFrom.getTime())
    var numberOfDays = Math.floor(interval / (24 * 60 * 60 * 1000));
    var numberOfWeeks = Math.ceil(numberOfDays / 7);
    


    // var firstJan = new Date(1900 + dateFrom.getYear(), 0, 1)
    var firstJan = new Date(2022, 0, 1)
    var daysThisYear = (dateFrom.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
    var startTime = timeInterval == 7 ? Math.ceil(daysThisYear / 7) : Math.ceil(daysThisYear)
    var endTime = startTime + (timeInterval == 7 ? numberOfWeeks : numberOfDays)

    let intervals: any = ['']
    responce_data.forEach((i:any) => { if(!i[labelType].title){ i[labelType].title = i[labelType].label } })

    let post_label_values: [] = responce_data.map((i: any) => i[labelType].title).filter((v: any, i: any, a: any) => a.indexOf(v) === i)

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
    

    for (let timeAt = startTime; timeAt <= endTime; timeAt++) {
      var intervalDate = new Date(dateFrom);

      dateFrom.setDate(dateFrom.getDate() + timeAt * timeInterval);

      labels.push(intervalDate.toISOString().slice(0, 10))

      datasets.forEach((dataset: any) => {
        let match = responce_data.filter((d: any) => d[labelType].title == dataset.label && d._id[timeInterval == 7 ? 'week' :'day'] == timeAt)
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

  const loadData = () => {
    setFetching(true)
    var dateFrom: any = new Date(filter.time_interval_from)
    var dateTo: any = new Date(filter.time_interval_to)
    const diffTime: number = Math.abs(dateFrom - dateTo);
    const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    setTimeInterval(diffDays < 14 ? 1 : 7)
    
    const fetchData = Get('posts_aggregated', {
      post_request_params: transform_filters_to_request(filter),
      axisX: axisX,
      axisY: axisY,
      days: timeInterval
    });


    fetchData.then((_data: Response<any>) => {
      let maybeData: any = E.getOrElse(() => [data_])(_data)
      if (!maybeData.length) return

      let dataset_and_labels: any = generate_dataset(maybeData, axisX, filter)
      setData(dataset_and_labels);
      setFetching(false)
    });
  }
    
  

  if (fetching) {
    return (
      <div className="chart-cont-l" >Loading...</div>
    )
  }
  return (
    <div className="chart-cont-l">
      {
        fetching ? (
          <div className="button-tr"><div><div className="round-btn-transp">Loading...</div></div></div>
        ) : (<div className="chart"><Bar options={options} data={data} /></div>)
      }
    </div>
  );
}
