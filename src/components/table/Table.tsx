import React, { useEffect, useMemo, useState } from 'react';

import { usePagination, useSortBy, useTable } from 'react-table';
import cols from '../../data/columns.json';
import { get } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { useGlobalState } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { match } from 'ts-pattern';
import { useNavigate } from "react-router-dom";

export function Table() {
  const [data, setData]: any = useState([]);
  const [filters, _]: any = useGlobalState('filters');
  const columns: any = useMemo(() => cols.data, []);

  const navigate = useNavigate();

  const routeChange = (postId: string) => navigate(`/details/${postId}`);

  useEffect(() => {

    if (filters.time_interval_from && filters.time_interval_to) {
      filters.time_interval_from += filters.time_interval_from.indexOf('T00:00:00.000Z') == -1 ? 'T00:00:00.000Z' : ''
      filters.time_interval_to += filters.time_interval_to.indexOf('T00:00:00.000Z') == -1 ? 'T00:00:00.000Z' : ''
      filters.platforms = filters.platforms.map((a: any) => a.label)
    }

    const fetchData = get('posts', {
      ...filters,
      "count": 10
    });

    fetchData.then(_data => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData.forEach) return

      maybeData.forEach((row: any) => {
        row.created_at = new Date(row.created_at.$date).toLocaleDateString("en-US")

        row.platform = match(row.platform)
          .with("facebook", () => <FontAwesomeIcon icon={faFacebook} />)
          .with("twitter", () => <FontAwesomeIcon icon={faTwitter} />)
          .with("youtube", () => <FontAwesomeIcon icon={faYoutube} />)
          .otherwise(() => <span>Invalid Icon</span>)
      })
      setData(maybeData);
    });

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
      <thead className="table--header">
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="table--row">
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps()} className="table--col">{column.render('Header')} {column.render('Header') == 'Date' ? '▼' : ''}</th>
            ))}
          </tr>
        ))}
      </thead>
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
              <tr {...row.getRowProps()} className="table--item" onClick={() => routeChange(_id.$oid)}>
                <div className="table--row">
                  {row.cells.map((cell: any) => {
                    return <td {...cell.getCellProps()} className="table--col">
                      {cell.render('Cell')}
                    </td>
                  })}
                </div>

                <div className="table--extra-row"><i className="icn icn--type-video"></i>
                  <div className="table--item-tags">
                    <div className="flex">
                      {/* <span className="font-xs mr-15">Tags</span> */}
                      <div className="flex">
                        {tags.map(({ title }: any) => (
                          <a href="£" className="badge bg-secondary">{title}</a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </tr>
            </>
          )
        })}
      </tbody>
      {/* <div className="table--body">
        <div className="table--item">
          <div className="table--row">
            <div className="table--col"><span className="font--xs">12/03/2021</span></div>
            <div className="table--col"><i className="icn icn--facebook"></i></div>
            <div className="table--col">
              <div className="flex">
                <div className="channgel-logo"><img src="" alt="" /></div><span>რადიო თავისუფლება</span>
              </div>
            </div>
            <div className="table--col"> <span>"საჭიროა ისიც გავარკვიოთ, რა სარგებლობას აძლევს რუსეთს აფხაზეთის დამოუკიდებლობის აღიარება" - სტატია, რომელიც აუცილებლად უნდა წაიკითხოთ! 👇</span></div>
            <div className="table--col"> <span>2000</span></div>
            <div className="table--col"> <span>500</span></div>
            <div className="table--col"> <span>256</span></div>
            <div className="table--col"> <span>3755</span></div>
            <div className="table--col"> <span>95</span></div>
          </div>
          
        </div>
        <div className="table--item">
          <div className="table--row">
            <div className="table--col"><span className="font--xs">12/03/2021</span></div>
            <div className="table--col"><i className="icn icn--facebook"></i></div>
            <div className="table--col">
              <div className="flex">
                <div className="channgel-logo"><img src="" alt="" /></div><span className="font--xs">რადიო თავისუფლება</span>
              </div>
            </div>
            <div className="table--col"> <span>"საჭიროა ისიც გავარკვიოთ, რა სარგებლობას აძლევს რუსეთს აფხაზეთის დამოუკიდებლობის აღიარება" - სტატია, რომელიც აუცილებლად უნდა წაიკითხოთ! 👇</span></div>
            <div className="table--col"> <span>2000</span></div>
            <div className="table--col"> <span>500</span></div>
            <div className="table--col"> <span>256</span></div>
            <div className="table--col"> <span>3755</span></div>
            <div className="table--col"> <span>95</span></div>
          </div>
          <div className="table--extra-row">
            <div className="table--item-type"><i className="icn icn--type-text"></i></div>
            <div className="table--item-tags">
              <div className="flex"><span className="font-xs mr-15">Tags</span>
                <div className="flex"><span className="badge bg-secondary">tag 1</span><span className="badge bg-secondary">tag 2</span><span className="badge bg-secondary">tag 3</span></div>
              </div>
            </div>
            <div className="table--item-tags">
              <div className="flex"><span className="font-xs mr-15">Person</span>
                <div className="flex"><span className="badge bg-secondary">Mikheil saakashvili</span><span className="badge bg-secondary">Giorgi gakharia</span><span className="badge bg-secondary">tag 3</span></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </table>
  )
  // return (
  //   <div>
  //     <h1>Table</h1>

  //     <table {...getTableProps()}>
  //       <thead>
  //         {headerGroups.map((headerGroup: any) => (
  //           <tr {...headerGroup.getHeaderGroupProps()}>
  //             {headerGroup.headers.map((column: any) => (
  //               <th {...column.getHeaderProps()}>{column.render('Header')}</th>
  //             ))}
  //           </tr>
  //         ))}
  //       </thead>

  //     </table>
  //   </div>
  // );
}