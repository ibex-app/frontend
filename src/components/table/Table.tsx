import React, { useEffect, useMemo, useState } from 'react';

import { useTable } from 'react-table';
import cols from '../../data/columns.json';
import { Https } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";

export function Table() {
  const [data, setData]: any = useState([]);
  const columns: any = useMemo(() => cols.data, []);

  useEffect(() => {
    const fetchData = Https.get('posts', {
      "time_interval_from": "2021-01-16T17:23:05.925Z",
      "time_interval_to": "2021-07-16T17:23:05.925Z",
      "count": 10
    });

    fetchData.then(_data => {
      let maybeData = E.getOrElse(() => [])(_data)
      maybeData.forEach((row: any) => {
        // console.log(row)
        row.created_at = new Date(row.created_at).toLocaleDateString("en-US")
      })
      setData(maybeData);
      // console.log(_data);
    });

  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data
  });

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
          const { labels } = data[i];
          const tags = [].concat(
            labels.topics || [],
            labels.persons || [],
            labels.locations || [],
            labels.organizations || []
          );

          return (
            <>
              <tr {...row.getRowProps()} className="table--item">
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