import { Typeahead } from 'react-bootstrap-typeahead';
import { useGlobalState } from '../../app/store';
import { FilterElementInput } from '../../types/form';

import 'react-bootstrap-typeahead/css/Typeahead.css';

type Tag = { id: number, label: string };

export function Tag({ data, onChange }: FilterElementInput) {
  const [filters, setFilters] = useGlobalState('filters');

  return (
    <div className="select-tags">
      <Typeahead
        multiple
        id={data.id}
        onChange={onChange}
        options={data.values}
        // placeholder="Choose item..."
        selected={filters[data.id]}
      />
    </div>
  )
}