import { FilterElementInput } from '../../types/form';
import { useGlobalState } from '../../app/store';

export const Checkbox = ({ data }: FilterElementInput) => {
  const [filters, setFilters] = useGlobalState('filters');

  const onChange = (e: any) => setFilters({ ...filters, [data.label]: e.target.checked });

  return <input className="checkbox" type="checkbox" onChange={onChange} />
}