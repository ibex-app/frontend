import React, { useEffect, useMemo, useState } from 'react';

import { Get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalState, setGlobalState } from '../../app/store';
import { Col } from 'antd';

export function Sidebar() {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  const [filters, setFilters] = useGlobalState('filters');
  const [user, setUser] = useGlobalState('user');


  const navigate = useNavigate();

  const routeChange = (monitorId: string) => {
    setGlobalState('filters', { ...filters, 'monitor_id': monitorId });
    navigate(`/results?monitor_id=${monitorId}`);
  }

  useEffect(() => {
    const fetchData = Get('get_monitors', { tag: '*' });

    fetchData.then((_data: Response<any>) => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData || !maybeData.forEach) return
      maybeData.forEach((k: any) => k.key = k._id)
      setData(maybeData)
      setFetching(false)
    });
  }, [])

  const logout = () => {
    setUser({})
  }
  return (
    <Col span={2} className="sidebar">
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
                <li> <a className="inactive" href="/">Loading...</a></li>
              ) : (data.map((monitor: any) => (<li key={monitor._id}> <a onClick={() => routeChange(monitor._id)}> {monitor.title}</a> </li>)))}
              <li>
                <Link to="/taxonomy/init">
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
          <li><Link to="/results/bar" >Bar</Link></li>
          <li><Link to="/results/line" >Line</Link></li>
          <li><Link to="/results/map" >Map</Link></li>
          <li><Link className="inactive" to="/results/graph" >Graph</Link></li>
          <li><Link className="inactive" to="/results/bubble" >Bubble</Link></li>
        </ul>
      </nav>
      <nav className="main-nav bottom">
        <ul>
          <li> {
            Object.keys(user).length ? <a onClick={logout} >Log out</a> : <Link to="/login" >Log in</Link>
          }
          </li>
        </ul>
      </nav>
      {/* <button className="btn btn--show-hide"><span>Hide sidebar</span><i className="icn icn--double-chevron-up"></i>
      </button> */}
    </Col>
  );
}

// https://www.pluralsight.com/guides/using-d3.js-inside-a-react-app