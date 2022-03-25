import React, { useEffect, useMemo, useState } from 'react';

import { get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalState, setGlobalState } from '../../app/store';

export function Sidebar() {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  const [filters, setFilters] = useGlobalState('filters');
  const [user, setUser] = useGlobalState('user');


  const navigate = useNavigate();

  const routeChange = (monitorId: string) => {
    setGlobalState('filters', {...filters, 'monitor_id': monitorId});
    navigate(`/frontend/results?monitor_id=${monitorId}`);
  }

  useEffect(() => {
    const fetchData = get('get_monitors', { tag: '*' });

    fetchData.then((_data: Response<any>) => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData.forEach) return
      maybeData.forEach((k: any) => k.key = k._id)
      setData(maybeData)
      setFetching(false)
    });
  }, [])
  
  const logout = () => {
    setUser({})
  }
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1></h1>
      </div>
      <nav className="main-nav">
        <ul>
          {/* <li><a className="inactive" href="/taxonomy">Taxonomy</a></li>
          <li><a className="inactive" href="/sources">Data Sources</a></li> */}
          <li><Link to="results">Monitors<i className="icn icn-arrow arrw-dwn"></i></Link>
            <ul>

              {fetching ? (
                <li>Loading...</li>
              ) : (data.map((monitor: any) => (<li key={monitor._id}> <a onClick={() => routeChange(monitor._id)}> {monitor.title}</a> </li>)))}
              <li>
                <Link to="/frontend/taxonomy/init">
                  + Create
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <nav className="main-nav">
        <ul>
          <li className="inactive"> . </li>
          <li><Link to="/frontend/results/bar" >Bar</Link></li>
          <li><Link to="/frontend/results/line" >Line</Link></li>
          <li><Link to="/frontend/results/map" >Map</Link></li>
          <li><Link className="inactive" to="/frontend/results/graph" >Graph</Link></li>
          <li><Link className="inactive" to="/frontend/results/bubble" >Bubble</Link></li>
        </ul>
      </nav>
      <nav className="main-nav bottom">
        <ul>
          <li> {
            Object.keys(user).length  ? <a onClick={logout} >Log out</a> : <Link to="/frontend/login" >Log in</Link>
            }
            </li>
        </ul>
      </nav>
      {/* <button className="btn btn--show-hide"><span>Hide sidebar</span><i className="icn icn--double-chevron-up"></i>
      </button> */}
    </aside>
  );
}

// https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app