import { Typeahead } from "react-bootstrap-typeahead"
import { FormElement } from "../../types/form"
import { last, map, pipe } from "ramda";

import './Select.css';
import { useState } from "react";
import { filterHasOperator, filterOperatorUpper } from "../../shared/Utils";

type Value = string | any[];

type CustomFormItemProps = {
  el: FormElement,
  value?: any;
  onChange?: (val: Value) => void
};

export const Tag = ({ el, onChange }: CustomFormItemProps) => {
  const { id, list, allowNew, placeholder, checkBoolUpper } = el;

  const [value, setValue] = useState<string[]>([]);

  // const newChecker = (results: Array<Object | string>, props: any) => {
  //   const selected = map<{ label: string }, string>(({ label }) => label)(props.selected);

  //   return selected.indexOf(props.text) < 0;
  // }
  const onValChange = (val: Value) => {

    if (typeof val === 'string') {
      onChange!(val);
      return;
    } else {
      if (checkBoolUpper && typeof val === 'object' && val.length) {
        const lastKeyword = last(val as any[])?.label;
        val[val.length - 1].label = pipe(filterHasOperator, filterOperatorUpper)(lastKeyword);
      }

      setValue(val);
      onChange!(val);
    }
  }

  return <Typeahead
    id={id}
    multiple
    options={list!}
    selected={value}
    placeholder={placeholder}
    allowNew={allowNew}
    onInputChange={(input, e) => onChange!(input)}
    onChange={onValChange}
  />
}