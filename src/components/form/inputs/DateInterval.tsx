import { DateRange } from 'react-date-range';
import { useGlobalState } from '../../../app/store';
import { FilterElementInput } from '../../../types/form';
import { useState } from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export const DateInterval = ({ data, onChange }: FilterElementInput) => {
  const [isOnGoing, setIsOnGoing] = useState(true);

  return <div>
    <label className="container"> On-going monitor?
      <span className={`checkmark ${isOnGoing ? 'checked' : ''}`} onClick={() => setIsOnGoing(!isOnGoing)}></span>
    </label>
    <input type="date" onChange={({ target }) => onChange({ time_interval_from: target.value })}></input>
    {
      isOnGoing
        ? <div className="disabled-input">End date not required</div>
        : <input type="date" onChange={({ target }) => onChange({ time_interval_to: target.value })}></input>
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