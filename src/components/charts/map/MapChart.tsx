import {  MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import filterData from '../../../data/filter.json';
import { Typeahead } from 'react-bootstrap-typeahead';
import {LatLngTuple} from 'leaflet'
import { useEffect, useMemo, useState } from 'react';

import {CRS} from 'leaflet'
import L from 'leaflet';
import { Get, Response, transform_filters_to_request } from '../../../shared/Http';
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
import { ChartInputFilter } from '../chartInputFilter'

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


export function MapChart({ filter }: ChartInputFilter) {
  useEffect(() => {
    if (Object.keys(filter).length) loadData('platform');
  }, [filter]);
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  
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
      labelType = 'locations'
      const fetchData = Get('posts_aggregated', {
          post_request_params: transform_filters_to_request(filter),
          axisX: labelType
      });
     

      fetchData.then((_data: any) => {
          let pre_data: any = { count: 0 }
          pre_data[labelType] = { title: 0 }

          let maybeData = E.getOrElse(() => [pre_data])(_data)
         
          setData(maybeData);
          setFetching(false)

          // console.log(data_);
      })
  }

    

    // export default BarChart


      const position = [51.505, -0.09]
     
    if (fetching) {
      return (
          <div className="results">Loading...</div>
      )
    }

    // const myIcon = L.icon({
    //   iconUrl: require('../../../circle.jpeg'),
    //   iconSize: [8,8],
    //   iconAnchor: [1, 1],
    //   // popupAnchor: null,
    //   // shadowUrl: null,
    //   // shadowSize: null,
    //   // shadowAnchor: null
    // });
  const customMarkerIcon = (point: any, index:number) => new L.DivIcon({
    html: '<div class="circle-map" style="background:' + cols[index%cols.length]+ ';width:' +point.count * 4+ 'px; height: '+ point.count * 4 +'px"></div>',
  });
      return(
        
      <div className="results">
            <select onChange={change}>
                {['count', 'hate-speech', 'reach-out', 'likes', 'shares', 'sentiment', 'comments'].map(d => <option key={d}>{d}</option>)}
            </select>

          <MapContainer center={[42.755229, 43.304470]} zoom={7} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              { data.map((point:any, index: number) => <Marker 
                icon={customMarkerIcon(point, index)} 
                // key={i} 
                position={{lat:point.locations.location[1], lng: point.locations.location[0]}}>
                <Popup>
                  <span>
                    {point.locations.title}<br />
                    
                    {point.count}<br />
                    {/* {elem.vehicles_launched.map((elem, i) => {
                      return ( <p key={i}>{elem}</p>)
                    })} */}
                  </span>
                </Popup>
                {/* <Circle 
                  center={{lat:point.locations.location[1], lng: point.locations.location[0]}}
                  fillColor="blue" 
                  radius={point.count * 50}/> */}
              </Marker> ) }
          </MapContainer>
      </div>
  )
}

// { data.map((point:any) => <Marker 
//   // key={i} 
//   position={{lat:point.locations.location[1], lng: point.locations.location[0]}}>
//   <Popup>
//     <span>
//       {point.locations.title}<br />
      
//       {point.count}<br />
//       {/* {elem.vehicles_launched.map((elem, i) => {
//         return ( <p key={i}>{elem}</p>)
//       })} */}
//     </span>
//   </Popup>
//   <Circle 
//     center={{lat:point.locations.location[1], lng: point.locations.location[0]}}
//     fillColor="blue" 
//     radius={point.count * 10}/>
// </Marker> ) }