import { FilterElementInput } from '../../types/form';
import { useGlobalState } from '../../app/store';

export const Text = ({ data, onChange }: FilterElementInput) => {
  const [filters, setFilters] = useGlobalState('filters');

  return <input type="text" onChange={({ target }) => onChange(target.value)} />
}