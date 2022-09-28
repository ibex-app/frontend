import { useEffect, useMemo, useState } from 'react';

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
import { Line } from 'react-chartjs-2';
import { ChartInputParams } from '../chartInputFilter';

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
      // stacked: true,
      title: {
        display: true,
        text: 'Week'
      }
    },
    y: {
      // display: true,
      // stacked: true,
      title: {
        display: true,
        text: 'Count'
      }
    }
  }
};

export function LineChart({ axisX, axisY, filter}: ChartInputParams) {
  console.log(axisX)
  useEffect(() => {
    if (Object.keys(filter).length) loadData();
  }, [filter]);

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


  // const change = (e: any) => {
  //   loadData(e.target.value)
  // }

  const generate_dataset = (responce_data: any, labelType: string, filters: any) => {
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

    let intervals: any = ['']
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
      borderColor:  cols[index],
      // backgroundColor: cols[index],
      // background: 'red',//cols[index],
      // fill: true,
      // pointBackgroundColor: 'rgba(0,0,0,.3)',
      // borderColor: 'rgba(0,0,0,0)',
      // pointHighlightStroke: cols[index],
      // borderCapStyle: 'butt',
      lineTension: .35,
      radius: 4  
    }))
    labels = []
    // debugger
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
    
    // datasets[0].data.forEach((value:any, index:number) => {
    //     let total:number = datasets.map( i => i.data[index]).reduce((a, b) => a + b, 0)
    //     // let curValue = 0 - total/2
    //     datasets[0].data[index] = 0 - total/2
    // })

    // datasets[0].data.forEach((value:any, index:number) => {
    //   let total:number = datasets.map( i => i.data[index]).reduce((a, b) => a + b, 0)
    //   let curValue = 0 - total/2
    //   console.log('total:', total, 'curValue:', curValue)
    //   const before = JSON.stringify(datasets.map( i => i.data[index]))  
    //   datasets.forEach(dataset => {
    //     const oldValue = dataset.data[index]
    //     dataset.data[index] = curValue
    //     curValue += oldValue
    //     console.log('curValue:', curValue, 'oldValue:', oldValue, 'dataset.data[index]:', dataset.data[index])

    //   })
    //   console.log(before, JSON.stringify(datasets.map( i => i.data[index])))
    // })
    return {
      labels,
      datasets: datasets,
    }
  }

  const loadData = () => {
    setFetching(true)
    const fetchData = Get('posts_aggregated', {
      post_request_params: transform_filters_to_request(filter),
      axisX: axisX,
      axisY: axisY,
      days: 7
    });


    fetchData.then((_data: Response<any>) => {
      let maybeData: any = E.getOrElse(() => [data_])(_data)
      if (!maybeData.length) {
        return
      }

      let dataset_and_labels: any = generate_dataset(maybeData, axisX, filter)
      setData(dataset_and_labels);
      setFetching(false)
      // console.log(dataset_and_labels)
    });

  }

  if (fetching) {
    return (
      <div className="chart-cont-l" >Loading...</div>
    )
  }
  return (
    <div className="chart-cont-l">
      {/* <select onChange={change}>
        {['platform', 'persons', 'locations', 'topics', 'datasources'].map(d => <option key={d}>{d}</option>)}
      </select>
      <select onChange={change}>
        {['count', 'hate-speech', 'reach-out', 'likes', 'shares', 'sentiment', 'comments'].map(d => <option key={d}>{d}</option>)}
      </select> */}
      {
        fetching ? (
          <div className="button-tr"><div><div className="round-btn-transp">Loading...</div></div></div>
        ) : (<div className="chart"><Line options={options} data={data} /></div>)
        // ) : (<div className="chart"></div>)
      }
    </div>
  );
}

// export default BarChart


// 52 + 35 + 11 + 9  = 107