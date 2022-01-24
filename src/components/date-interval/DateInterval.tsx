import { DateRange } from 'react-date-range';
import { useGlobalState, setGlobalState } from '../../app/store';
import { FilterElementInput } from '../../types/form';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export const DateInterval = ({ data }: FilterElementInput) => {

  const [filters, setFilters] = useGlobalState('filters');

  const onChange = (item: any) => setGlobalState('filters', { ...filters, [data.id]: item });

  return <DateRange
    editableDateInputs={true}
    onChange={onChange}
    moveRangeOnFirstSelection={false}
    ranges={filters[data.id]}
    showDateDisplay={false}
  />
}