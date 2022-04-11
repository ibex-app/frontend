import { FilterElementInput } from '../../../types/form';

export const Text = ({ data, onChange }: FilterElementInput) => {

  const lll = (a: any) => {
    console.log(a)
  }
  return <input type="text" onChange={({ target }) => onChange(target.value)} />
}