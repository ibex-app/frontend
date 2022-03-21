import { FilterElementInput } from '../../types/form';
import { useGlobalState } from '../../app/store';

export const Date = ({ data, onChange }: FilterElementInput) => {
  const [filters, setFilters] = useGlobalState('filters');

  return <input
    type="date"
    onChange={({ target }) => onChange(target.value)}
    value={data.value} />
}