import { Typeahead } from "react-bootstrap-typeahead"
import { FormElement } from "../../types/form"
import { map } from "ramda";

import './Select.css';

type CustomFormItemProps = {
  el: FormElement,
  value?: any;
  onChange?: (val: string | string[]) => void
};

export const Tag = ({ el, onChange }: CustomFormItemProps) => {
  const { id, list, allowNew, placeholder } = el;

  // const newChecker = (results: Array<Object | string>, props: any) => {
  //   const selected = map<{ label: string }, string>(({ label }) => label)(props.selected);

  //   return selected.indexOf(props.text) < 0;
  // }

  return <Typeahead
    id={id}
    multiple
    options={list!}
    placeholder={placeholder}
    allowNew={allowNew}
    onInputChange={(input, e) => onChange!(input)}
    onChange={onChange}
  />
}