import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartInputParams } from '../chartInputFilter';
import { Get, Response, transform_filters_to_request } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";

ChartJS.register(ArcElement, Tooltip, Legend);

// export const datax = {
//   labels: ["red", "green", "purple", "yellow", "brown", "blue"],
//   datasets: [
//     {
//       label: '# of Votes',
//       data: [
//         [123,32, 55],
//         [52],
//         [22],
//         [122,54, 9],
//         [52],
//         [32],
//       ],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };



export function DoughnatChart({axisX, axisY, filter}: ChartInputParams) {
  const [fetching, setFetching] = useState(false);
  
  useEffect(() => {
    if (Object.keys(filter).length) loadData();
  }, [filter]);
  
  let labels = [''];
  
  let data_: any = {
    labels,
    datasets: [
      {
        data: labels.map(() => 0),
        backgroundColor: '#f59c34'
      },
    ],
  };
  
  const [data, setData] = useState(data_);

  var cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]

  const generate_dataset = (responce_data: any, labelType: string, filters: any) => {
    let dateFrom: Date = new Date(filters.time_interval_from)
    let dateTo: Date = new Date(filters.time_interval_to)
    dateTo.setDate(dateTo.getDate() + 7);

    let interval: number = (dateTo.getTime() - dateFrom.getTime())
    let numberOfDays = Math.floor(interval / (24 * 60 * 60 * 1000));
    let numberOfWeeks = Math.ceil(numberOfDays / 7);

    // let firstJan = new Date(1900 + dateFrom.getYear(), 0, 1)
    let firstJan = new Date(2022, 0, 1)
    let daysThisYear = (dateFrom.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
    let startWeek = Math.ceil(daysThisYear / 7)

    responce_data.forEach((i: any) => {
      if (!i[labelType].title) {
        i[labelType].title = i[labelType].label
      }
    })

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

    // labels = []

    // labels.push(post_label_values.toString());

    for (let week = startWeek; week <= startWeek + numberOfWeeks; week++) {
      var intervalDate = new Date(dateFrom);
      dateFrom.setDate(dateFrom.getDate() + week * 7);

      //labels.push(intervalDate.toISOString().slice(0, 10))

      datasets.forEach((dataset: any) => {
        let match = responce_data.filter((d: any) => d[labelType].title === dataset.label && d._id.week === week)
        console.log(match);
        if (!match.length) {
          dataset.data.push(0)
        } else if (labelType === 'platform') {
          let count = match.reduce((a: any, b: any) => a += b.count, 0)
          dataset.data.push(count)
        } else {
          dataset.data.push(match.length)
        }
      })
    }

    console.log(datasets)

    return {
      labels: post_label_values,
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
      setFetching(false);
    });
  }

  if (fetching) {
    return (
      <div className="results" >Loading...</div>
    )
  }
  
  return (
    <div className="results">
      {
        console.log("Data", data)
      }
      {
        console.log("Actual Data", data?.datasets)
      }

      {
        fetching ? (
          <div className="button-tr">
            <div>
              <div className="round-btn-transp">
                Loading...
              </div>
            </div>
          </div>
          ) : 
          <div className="results">
              <div className="chart"><Doughnut style={{ width: '150px', height: '150px' }} data={data} /></div>
          </div>
      }
    </div>
  )
}
