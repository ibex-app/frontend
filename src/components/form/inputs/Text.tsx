import { FilterElementInput } from '../../../types/form';

export const Text = ({ data, onChange }: FilterElementInput) =>
  <input type="text" onChange={({ target }) => onChange(target.value)} />