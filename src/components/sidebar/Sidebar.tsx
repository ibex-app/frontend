import React, { useEffect, useMemo, useState } from 'react';

import { get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { useNavigate } from "react-router-dom";
import { useGlobalState, setGlobalState } from '../../app/store';

export function Sidebar() {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  
  const navigate = useNavigate();

  const routeChange = (monitorId: string) => {
    // setGlobalState('filters', {});
    setGlobalState('monitorId', monitorId)
    navigate(`results?monitor_id=${monitorId}`);
  }

  useEffect(() => {
      const fetchData = get('get_monitors', {tag: '*'});
     
      fetchData.then((_data: Response<any>) => {
        let maybeData = E.getOrElse(() => [])(_data)
        if (!maybeData.forEach) return
        maybeData.forEach((k:any) => k.key = k._id)
        setData(maybeData)
        setFetching(false)
      });
  }, [])
  // loadData()
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1></h1>
      </div>
      <nav className="main-nav">
        <ul>
          {/* <li><a className="inactive" href="/taxonomy">Taxonomy</a></li>
          <li><a className="inactive" href="/sources">Data Sources</a></li> */}
          <li><a href="/results">Monitors<i className="icn icn-arrow arrw-dwn"></i></a>
            <ul>
              
              { fetching ? (
                <li>Loading...</li>
              ) : (data.map(  (monitor: any) => (<li key={monitor._id}> <a onClick={() => routeChange(monitor._id)}> {monitor.title}</a> </li>)))}
              <li><a className="" href="/taxonomy-init">+ Create</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <nav className="main-nav">
        <ul>
          <li className="inactive"> . </li>
          <li><a href="/results/bar" >Bar</a></li>
          <li><a href="/results/line" >Line</a></li>
          <li><a href="/results/map" >Map</a></li>
          <li><a className="inactive" href="/results/graph" >Graph</a></li>
          <li><a className="inactive" href="/results/bubble" >Bubble</a></li>
        </ul>
      </nav>
      <nav className="main-nav bottom">
        <ul>
          <li><a href="#" >Log out</a></li>
        </ul>
      </nav>
      {/* <button className="btn btn--show-hide"><span>Hide sidebar</span><i className="icn icn--double-chevron-up"></i>
      </button> */}
    </aside>
  );
}

// https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app