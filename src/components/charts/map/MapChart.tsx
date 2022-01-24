import {  MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import filterData from '../../../data/filter.json';
import { Typeahead } from 'react-bootstrap-typeahead';
import {LatLngTuple} from 'leaflet'
import { useEffect, useMemo, useState } from 'react';

import {CRS} from 'leaflet'
import L from 'leaflet';
import { Https } from '../../../shared/Http';
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


export function MapChart() {

    const [filters, setFilters] = useGlobalState('filters');
    useEffect(() => {
        console.log(filters);
    }, [filters]);

    // const BarChart = () => {
    var cols = ["#bf501f", "#f59c34", "#89a7c6", "#7bc597", "#8d639a", "#8d639a", "#e4a774", "#828687", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick"]
    let labels = [0]
    let data_: any = []

    const [data, setData] = useState(data_);
    const [fetching, setFetching] = useState(true);

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
            "axisX": 'locations',
            "days": 30
        });

        fetchData.then(_data => {
            let pre_data: any = { count: 0 }
            pre_data[labelType] = { title: 0 }
            let maybeData = E.getOrElse(() => [pre_data])(_data)
            // let labels = maybeData.map(i => i[labelType].title)
            
            // data_ = {
            //     labels,
            //     datasets: [
            //         {
            //             fill: false,
            //             lineTension: 0.1,
            //             backgroundColor: '#8d639a',
            //             pointBorderColor: '#111',
            //             pointBackgroundColor: '#ff4000',
            //             pointBorderWidth: 2,
            //             label: labelType,
            //             data: maybeData.map(i => i.count),
            //         },
            //     ],
            // };
            setData(maybeData);
            setFetching(false)
        });

    }

    useEffect(() => fetchAndSet('topics'), []);

    

    // export default BarChart


      const position = [51.505, -0.09]
     
    if (fetching) {
      return (
          <div className="results">Loading...</div>
      )
    }

    const myIcon = L.icon({
      iconUrl: require('../../../circle.jpeg'),
      iconSize: [1,1],
      iconAnchor: [1, 1],
      // popupAnchor: null,
      // shadowUrl: null,
      // shadowSize: null,
      // shadowAnchor: null
  });
  const customMarkerIcon = new L.DivIcon({
    html: '<div class="circle-map"></div>',
  });
      return(
        
      <div className="results">
            <select onChange={change}>
                {['topics', 'persons', 'locations', 'platforms', 'datasources'].map(d => <option key={d}>{d}</option>)}
            </select>

          <MapContainer center={[42.755229, 43.304470]} zoom={7} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              { data.map((point:any) => <Marker 
                icon={customMarkerIcon} 
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
                <Circle 
                  center={{lat:point.locations.location[1], lng: point.locations.location[0]}}
                  fillColor="blue" 
                  radius={point.count * 10}/>
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