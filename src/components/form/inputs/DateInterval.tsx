import { DateRange } from 'react-date-range';
import { useGlobalState } from '../../../app/store';
import { FilterElementInput } from '../../../types/form';
import { useState } from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { formatDate } from '../../../shared/Utils';

export const DateInterval = ({ data, onChange }: FilterElementInput) => {
  const [isOnGoing, setIsOnGoing] = useState(true);

  const _onChange = (key: string) => ({ target }: any) => onChange({ [key]: formatDate(target.value) });

  return <div>
    <label className="container"> On-going monitor?
      <span className={`checkmark ${isOnGoing ? 'checked' : ''}`} onClick={() => setIsOnGoing(!isOnGoing)}></span>
    </label>
    <input type="date" onChange={_onChange('date_from')}></input>
    {
      isOnGoing
        ? <div className="disabled-input">End date not required</div>
        : <input type="date" onChange={_onChange('date_to')}></input>
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