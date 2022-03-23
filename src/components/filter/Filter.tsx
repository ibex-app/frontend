import React, { useEffect, useState } from 'react';
import { match } from 'ts-pattern';
import { FilterElement } from '../../types/form';
import { setGlobalState, useGlobalState } from '../../app/store';
import { reduce } from 'fp-ts/lib/Array';
import { Tag } from '../inputs/Tag';
import { Checkbox } from '../inputs/Checkbox';
import { Text } from '../inputs/Text';
import { Date } from '../inputs/Date';
import { DateInterval } from '../date-interval/DateInterval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFolderArrowDown } from "@fortawesome/free-brands-svg-icons"
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import moment from "moment";
import { addParamsToUrl, getParamsAsObject } from '../../shared/Utils';
import { type } from 'os';

export function Filter() {
  const { data }: { data: FilterElement[] } = require('../../data/filter.json')

  const [filters, setFilters] = useGlobalState('filters');

  const getFilters = (): Object => {
    const paramsFromUrl = getParamsAsObject();
    ['platform', 'author_platform_id', 'topics', 'persons', 'locations'].forEach((filterName:string) => {
      const curFilter:any = paramsFromUrl[filterName]
      if(curFilter){
        const filterElement: any = data.find(k => k.id.toString() == filterName)
        paramsFromUrl[filterName] = curFilter.map((k: string) => filterElement.values.find((l:any) => l._id == k))
      }
    })

    const defaultFilters = reduce({}, (acc:any, cur: FilterElement) => (
      acc[cur.id] ? acc : { ...acc, [cur.id]: cur.value }
    ))(data);

    return { ...defaultFilters, ...paramsFromUrl };
  };

  useEffect(() => setFilters(getFilters()), [])

  const getElem = (el: FilterElement) => {
    if (el.value === 'today') {
      el.value = moment().format("YYYY-MM-DD")
    }

    const onChange = (item: any) => {
      setGlobalState('filters', { ...filters, [el.id]: item });
      let str_param = item.length ? item.map((i:any) => i._id).join(',') : item
      console.log(item, str_param)
      addParamsToUrl({ [el.id]: str_param });
    }

    return match(el.type)
      .with("data-interval", () => <DateInterval data={el} onChange={onChange} />)
      .with("tag", () => <Tag data={el} onChange={onChange} />)
      .with("date", () => <Date data={el} onChange={onChange} />)
      .with("text", () => <Text data={el} onChange={onChange} />)
      .with("checkbox", () => <Checkbox data={el} onChange={onChange} />)
      .otherwise(() => {
        console.error(`Invalid component name ${el.type}`);
        return <></>
      })
  }

  return (
    <section className="filter">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  {data.map(el => (
                    <div className="col-2" key={el.id}>
                      <p className="font--xs font--gray-3 mb-5">{el.label}</p>
                      <div className="form__item">
                        {getElem(el)}
                      </div>
                    </div>
                  ))}
                  <div className="col-2">

                    <div className="form__item">

                    </div>
                  </div>
                  <div className="col-2">

                    {/* <div className="form__item btn">
                        <a href="#" >Download</a>
                      </div> */}
                  </div>
                  <div className="col-2">

                    <div className="form__item btn-small">
                      {/* <a href="#" >Save</a> */}
                      <FontAwesomeIcon icon={faFileArrowDown} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
