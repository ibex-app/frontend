import { FilterElementInput } from '../../../types/form';
import { useGlobalState } from '../../../app/store';

export const Checkbox = ({ data, onChange }: FilterElementInput) => {
  const [filters, setFilters] = useGlobalState('filters');

  return <input
    className="checkbox"
    type="checkbox"
    checked={filters[data.id]}
    onChange={({ target }) => onChange(target.checked)} />
}