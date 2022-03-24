import { FilterElementInput } from '../../../types/form';

export const Date = ({ data, onChange }: FilterElementInput) => {
  return <input
    type="date"
    onChange={({ target }) => onChange(target.value)}
    value={data.value} />
}