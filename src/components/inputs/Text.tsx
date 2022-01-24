import { FilterElementInput } from '../../types/form';
import { useGlobalState } from '../../app/store';

export const Text = ({ data }: FilterElementInput) => {
  const [filters, setFilters] = useGlobalState('filters');

  const onChange = (e: any) => setFilters({ ...filters, [data.label]: e.target.value });

  return <input className="checkbox" type="text" onChange={onChange} />
}