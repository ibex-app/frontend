import React, { useEffect, useMemo, useState } from 'react';

import { usePagination, useSortBy, useTable } from 'react-table';
import cols from '../../data/columns.json';
import { get, transform_filters_to_request } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { useGlobalState } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
// import { } from "@fortawesome/free-brands-svg-icons"

import { faThumbsUp, faShare, faMessage, faThumbsDown, faBiohazard } from '@fortawesome/free-solid-svg-icons'
import { match } from 'ts-pattern';
import { useNavigate } from "react-router-dom";
import './table.css';



export function Table() {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(false);

  const [filters, _]: any = useGlobalState('filters');
  const columns: any = useMemo(() => cols.data, []);
  let start_index = 0;
  let count = 40;

  const navigate = useNavigate();

  const routeChange = (postId: string) => navigate(`/details/${postId}`);

  const loadData = (si?: number, c?: number, append?: boolean) => {
    setFetching(true)
    start_index = si || start_index;
    count = c || count;

    const fetchData = get('posts', {
      ...transform_filters_to_request(filters),
      "count": count,
      "start_index": start_index
    });

    fetchData.then(_data => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData.forEach) return

      maybeData.forEach((row: any) => {
        row.created_at = new Date(row.created_at.$date).toLocaleString('en-us', { month: 'short', year: 'numeric', day: 'numeric' })
        row.platform = match(row.platform)
          .with("facebook", () => <FontAwesomeIcon icon={faFacebook} />)
          .with("twitter", () => <FontAwesomeIcon icon={faTwitter} />)
          .with("youtube", () => <FontAwesomeIcon icon={faYoutube} />)
          .otherwise(() => <span>Invalid Icon</span>)

        // Channel
      })
      setData(append ? [...data, ...maybeData] : [...maybeData])
     
      setFetching(false)
    });
  }

  useEffect(() => {
    if (Object.keys(filters).length) loadData();
  }, [filters]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data
    },
    useSortBy,
    usePagination
  );

  return (
    <table {...getTableProps()} className="table">
      {/* <thead className="table--header">
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="table--row">
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps()} className="table--col">{column.render('Header')} {column.render('Header') == 'Date' ? '▼' : ''}</th>
            ))}
          </tr>
        ))}
      </thead> */}
      <tbody className="table--body" {...getTableBodyProps()}>
        {rows.map((row: any, i: number) => {
          prepareRow(row)
          const { labels, _id } = data[i];
          const tags = [].concat(
            labels.topics || [],
            labels.persons || [],
            labels.locations || [],
            labels.organizations || []
          );

          return (
            <>
              <tr {...row.getRowProps()} className="table--item">
                <td className="table--row">
                  <div >
                    {<div {...row.cells[3].getCellProps()} onClick={() => routeChange(_id.$oid)} className="title"> {
                      row.cells[3].value.length < 100 ? row.cells[3].value : row.cells[3].value.slice(0, 220)} </div>}
                    {<div {...row.cells[0].getCellProps()} className="sub-title"> {row.cells[0].render('Cell')} | chanell name </div>}
                    {/* {row.cells.map((cell: any) => {
                      return <div {...cell.getCellProps()} className="table--col"> {cell.render('Cell')} </div>
                  })} */}
                    {<div {...row.cells[1].getCellProps()} className="platform"> {row.cells[1].render('Cell')} <a target="_blank" href={row.cells[4].value}>{row.cells[4].render('Cell')}</a> </div>}
                    {<div className="scores">
                      <FontAwesomeIcon icon={faThumbsUp} /> {row.cells[6].value}
                      <FontAwesomeIcon icon={faThumbsDown} /> {row.cells[7].value}
                      <FontAwesomeIcon icon={faShare} /> {row.cells[8].value}
                      <FontAwesomeIcon icon={faMessage} /> {row.cells[9].value}
                      <FontAwesomeIcon icon={faBiohazard} /> {row.cells[10].value} </div>}

                  </div>
                  {<img src={row.cells[5].value} />}

                  <div className="table--extra-row"><i className="icn icn--type-video"></i>
                    <div className="table--item-tags">
                      <div className="flex">
                        {/* <span className="font-xs mr-15">Tags</span> */}
                        <div className="flex">
                          {tags.map(({ title }: any) => (<a href="£" className="badge bg-secondary">{title}</a>))}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </>
          )
        })}
        {
          !fetching && rows.length ? (
            <tr className="button-tr" onClick={() => loadData(start_index + count, 20, true)}>
              <td><div className="round-btn-transp">
                Load more results
              </div></td>
            </tr>
          ) : (<tr ><td></td></tr>)
        }
        {
          !fetching && !rows.length ? (
            <tr className="button-tr" >
              <td><div className="round-btn-transp">
                No posts to show
              </div></td>
            </tr>
          ) : (<tr ><td></td></tr>)

        }
        {
          fetching ? (
            <tr className="button-tr">
              <td><div className="round-btn-transp">
                Loading...
              </div></td>
            </tr>
          ) : (<tr ><td></td></tr>)
        }

      </tbody>

    </table>
  )
}