import { FilterElementInput } from '../../../types/form';

export const Text = ({ data, onChange }: FilterElementInput) =>
  <input type="text" {...data.required ? 'required' : ''} onChange={({ target }) => onChange(target.value)} />