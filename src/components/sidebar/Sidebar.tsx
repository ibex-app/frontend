import React, { useEffect, useMemo, useState } from 'react';

import { get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";

export function Sidebar() {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);

  useEffect(() => {

      const fetchData = get('get_monitors', {tag: '*'});
      
      fetchData.then((_data: Response<any>) => {
        let maybeData = E.getOrElse(() => [])(_data)
        if (!maybeData.forEach) return
        setData(maybeData)
        console.log(maybeData)
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
              ) : (data.map(  (monitor: any) => (<li> <a href='/results/{monitor.id}'> {monitor.title}</a> </li>)))}
              <li><a className="" href="/taxonomy-init">+ Create</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <nav className="main-nav">
        <ul>
          <li className="inactive"> . </li>
          <li><a href="/results" >Table</a></li>
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