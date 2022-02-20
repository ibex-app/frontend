import { FilterElementInput } from '../../types/form';
import { useGlobalState } from '../../app/store';

export const Date = ({ data }: FilterElementInput) => {
  const [filters, setFilters] = useGlobalState('filters');

  const onChange = (e: any) => {
    setFilters({ ...filters, [data.id]: e.target.value });
  };


  // setFilters({ ...filters, [data.id]: data.value });

  return <input type="date" onChange={onChange} value={data.value}/>
}