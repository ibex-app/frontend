import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartInputParams } from '../chartInputFilter';
import { Get, Response, transform_filters_to_request } from '../../../shared/Http';
import * as E from "fp-ts/lib/Either";

ChartJS.register(ArcElement, Tooltip, Legend);


export function DoughnatChart({axisX, axisY, filter}: ChartInputParams) {
  const [fetching, setFetching] = useState(false);
  
  useEffect(() => {
    if (Object.keys(filter).length) loadData();
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
  
  var exactCols = [ 
    ['facebook', '#464b9c'],
    ['youtube', '#f10000'],
    ['twitter', '#51a3e3']
  ]

  var cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]
  
  const options = {
    maintainAspectRatio: false,
    type: 'line',
    responsive: true,
    borderWidth: 6,
    cutout: '92%',
    borderJoinStyle: 'round',
    spacing: 9,
    plugins: {
      filler: {
        propagate: false,
      },
      legend: {
        position: 'bottom' as const,
      },
      padding: {
        top: 50,
        left: 50,
        right: 15,
        bottom: 50
      },
    },
  };

  const getCol = (label: string, index: number) => {
    let col: string = ''
    exactCols.forEach((exactCol:any) => {
      if(exactCol[0] === label) col = exactCol[1]
    })
    
    return col || cols[index]
  }

  const generate_dataset = (responce_data: any) => {
    return {
      labels: responce_data.map((dataPoint:any) => dataPoint[axisX]),
      datasets: [{
        data: responce_data.map((dataPoint:any) => dataPoint[axisY]),
        backgroundColor: responce_data.map((dataPoint:any, index:number) => getCol(dataPoint[axisX], index)),
        borderColor: responce_data.map((dataPoint:any, index:number) => getCol(dataPoint[axisX], index))
      }]
    }
  }

  const loadData = () => {
    setFetching(true)
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
      setData(dataset_and_labels);
      setFetching(false);
    });
  }

  if (fetching) {
    return (
      <div className="chart-cont-sm" >Loading...</div>
    )
  }
  
  return (
    <div className="chart-cont-sm">
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
        <div className="chart"><Doughnut options={options} data={data} /></div>
      }
    </div>
  )
}
