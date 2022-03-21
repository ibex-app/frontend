import React, { useEffect, useMemo, useState } from 'react';

import { usePagination, useSortBy, useTable } from 'react-table';
import cols from '../../data/columns.json';
import { get, Response, transform_filters_to_request } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { useGlobalState } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
// import { } from "@fortawesome/free-brands-svg-icons"

import { faThumbsUp, faShare, faMessage, faThumbsDown, faBiohazard } from '@fortawesome/free-solid-svg-icons'
import { match } from 'ts-pattern';
import { useNavigate } from "react-router-dom";


export function Sidebar() {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);

  const loadData = () => {
    setFetching(true)

    const fetchData = get('get_monitors');

    fetchData.then((_data: Response<any>) => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData.forEach) return
      setData(maybeData)
      console.log(maybeData)
      setFetching(false)
    });
  }
  // loadData()
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1></h1>
      </div>
      <nav className="main-nav">
        <ul>
          <li><a className="inactive" href="/taxonomy">Taxonomy</a></li>
          <li><a className="inactive" href="/sources">Data Sources</a></li>
          <li><a href="/results">Monitors<i className="icn icn-arrow arrw-dwn"></i></a>
            <ul>
              <li><a className="inactive" href="#">COVID19</a></li>
              <li><a className="inactive" href="#">Elections</a></li>
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