import { DateRange } from 'react-date-range';
import { useGlobalState } from '../../../app/store';
import { FilterElementInput } from '../../../types/form';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { pipe } from 'fp-ts/lib/function';

export const DateInterval = ({ data, onChange }: FilterElementInput) => {

  type CustomDate = {
    startDate: Date,
    endDate: Date,
    key: string
  }

  const [filters, setFilters] = useGlobalState('filters');

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

  return <DateRange
    ranges={filters[data.id] || [selectionRange]}
    editableDateInputs={true}
    onChange={({ date }: any) => pipe(date, getDate, onChange)}
    moveRangeOnFirstSelection={false}
    showDateDisplay={false}
  />
}