import React, { useEffect, useState } from 'react';
import { match } from 'ts-pattern';
import { FilterElement } from '../../types/form';
import { useGlobalState } from '../../app/store';
import { reduce } from 'fp-ts/lib/Array';
import { Tag } from '../inputs/Tag';
import { Checkbox } from '../inputs/Checkbox';
import { Text } from '../inputs/Text';
import { Date } from '../inputs/Date';
import { DateInterval } from '../date-interval/DateInterval';

export function Filter() {
  const { data }: { data: FilterElement[] } = require('../../data/filter.json')

  const [_, setFilters] = useGlobalState('filters');

  useEffect(() => {
    // generate state object from data and set it to global state
    setFilters(reduce({}, (acc, cur: FilterElement) => (
      { ...acc, [cur.id]: cur.value }
    ))(data));
  }, [])

  const getElem = (el: FilterElement) => match(el.type)
    .with("data-interval", () => <DateInterval data={el} />)
    .with("tag", () => <Tag data={el} />)
    .with("date", () => <Date data={el} />)
    .with("text", () => <Text data={el} />)
    .with("checkbox", () => <Checkbox data={el} />)
    .otherwise(() => {
      console.error(`Invalid component name ${el.type}`);
      return <></>
    })

  return (
    <section className="filter">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <div className="row">
                  {data.map(el => (
                    <div className="col-2">
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
                      
                      <div className="form__item btn">
                        <a href="#" >Download</a>
                      </div>
                    </div>
                    <div className="col-2">
                      
                      <div className="form__item btn">
                        <a href="#" >Save</a>
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
