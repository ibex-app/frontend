import { DateRange } from 'react-date-range';
import { useGlobalState } from '../../../app/store';
import { FilterElementInput } from '../../../types/form';
import { useState } from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export const DateInterval = ({ data, onChange }: FilterElementInput) => {

  type CustomDate = {
    startDate: Date,
    endDate: Date,
    key: string
  }

  const [filters, setFilters] = useGlobalState('filters');
  const [isOnGoing, setIsOnGoing] = useState(true);


  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'date'
  }

  const getDate = ({ startDate, endDate }: CustomDate) => ({
    date: {
      date_from: startDate,
      date_to: endDate
    }
  });

  return <div>
    <label className="container"> On-going monitor?
      <span className={`checkmark ${isOnGoing ? 'checked' : ''}`} onClick={() => setIsOnGoing(!isOnGoing)}></span>
    </label>
    <input type="date" ></input>
    {
      isOnGoing
        ? <div className="disabled-input">End date not required</div>
        : <input type="date" ></input>
    }

  </div>
  // return <DateRange
  //   ranges={filters[data.id] || [selectionRange]}
  //   editableDateInputs={true}
  //   onChange={({ date }: any) => pipe(date, getDate, onChange)}
  //   moveRangeOnFirstSelection={false}
  //   showDateDisplay={false}
  // />
}