import { FilterElementInput } from '../../../types/form';

export const TextBox = ({ data, onChange }: FilterElementInput) =>
  <textarea onChange={({ target }) => onChange(target.value)} />