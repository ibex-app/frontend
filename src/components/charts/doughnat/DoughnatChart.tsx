import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Bar  } from 'react-chartjs-2';
import Spinner from '../../../antd/Spinner/Spinner';
import { ChartInputParams } from '../chartInputFilter';
import { Get, Response, transform_filters_to_request } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";
// import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);
// ChartJS.register(ChartDataLabels);

const exactCols:any = {
  facebook: '#2e89ff',
  youtube: '#f10000',
  twitter: '#51a3e3'
}
const cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]
export const getCol = (dataPoint: any, index: number) => {
  const label:string = dataPoint.platform || dataPoint.label || dataPoint.title
  return exactCols[label] || cols[index]
}

export function DoughnatChart({axisX, axisY, filter, type}: ChartInputParams) {
  const [fetching, setFetching] = useState(false);
  
  useEffect(() => {
    if (Object.keys(filter).length && filter.time_interval_from && filter.time_interval_to) loadData();
  }, [filter]);
  
  let data_: any = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };
  
  const [data, setData] = useState(data_);
  
  
  
  const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    type: 'line',
    responsive: true,
    // borderWidth: 6,
    // cutout: '92%',
    borderJoinStyle: 'round',
    // spacing: 9,
    plugins: {
      // ChartDataLabels,
      // doughnutlabel: {
      //   labels: [{
      //     text: '550',
      //     font: {
      //       size: 20,
      //       weight: 'bold'
      //     }
      //   }, {
      //     text: 'total'
      //   }]
      // },
      // datalabels: {
       
      // },
      filler: {
        propagate: false,
      },
      legend: {
        display: type !== 'bar',
        position: 'bottom' as const,
      },
      padding: {
        top: 150,
        left: 150,
        right: 15,
        bottom: 50
      },
    },
  };

 

  const generate_dataset = (responce_data: any) => {
    responce_data.forEach((dataPoint:any) => dataPoint.label = dataPoint.label || dataPoint.title || dataPoint.term || (dataPoint.platform  + '_' + dataPoint.account_title))
    return {
      labels: responce_data.map((dataPoint:any) => dataPoint.label),
      datasets: [{
        label: axisX,
        data: responce_data.map((dataPoint:any) => dataPoint.count),
        backgroundColor: responce_data.map((dataPoint:any, index:number) => getCol(dataPoint, index)),
        // borderColor: responce_data.map((dataPoint:any, index:number) => getCol(dataPoint.platform, index))
      }],
      // innerText: 'total: ' + responce_data.map((dataPoint:any) => dataPoint.count).reduce((a:number, b:number) => a + b, 0)
    }
  }

  const loadData = () => {
    setFetching(true)
    if(type == 'bar'){
      options.plugins.legend.display = false
      // options.plugins.legend.position = undefined
    }
    const fetchData = Get('posts_aggregated', {
      post_request_params: transform_filters_to_request(filter),
      axisX: axisX,
      axisY: axisY
    });

    fetchData.then((_data: Response<any>) => {
      let maybeData: any = E.getOrElse(() => [data_])(_data)
      if (!maybeData.length) {
        return
      }

      let dataset_and_labels: any = generate_dataset(maybeData)
      // console.log(dataset_and_labels)
      setData(dataset_and_labels);
      setFetching(false);
    });
  }

  return <div className="chart-cont-sm">
      <div className="chart">
        {
          fetching 
          ? <div className="button-tr">
              <div><div className="chart-loadding"> Loading the chart... <Spinner /></div></div>
            </div>
          : type == 'bar' 
                ? <Bar options={options} data={data} />
                : <Doughnut options={options} data={data} />
        }
      </div>
    </div>
}
