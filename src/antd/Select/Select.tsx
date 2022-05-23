import { Typeahead, useToken } from "react-bootstrap-typeahead"
import { FormElement } from "../../types/form"
import { last, map, pipe } from "ramda";

import './Select.css';
import { useState } from "react";
import { filterHasOperator, filterOperatorUpper, platformIcon } from "../../shared/Utils";

type Value = string | any[];

type CustomFormItemProps = {
  el: FormElement,
  value?: any;
  onChange?: (val: Value) => void
};

type Option = { label: string, icon?: string }
type CustomTokenInput = {
  option: Option,
  props: any,
  index: number
}

const TypeaheadOverride: any = Typeahead;

const CustomToken = ({ option, props, index }: CustomTokenInput) => {
  const { onRemove } = useToken(props);

  return <div className="rbt-token rbt-token-removeable" tabIndex={index}>
    {option.icon ? option.label : <>{option.icon && platformIcon(option.icon)} {option.label}</>}
    <button tabIndex={-1} aria-label="Remove" className="close rbt-close rbt-token-remove-button" type="button" onClick={onRemove}>
      <span aria-hidden="true">×</span>
      <span className="sr-only visually-hidden">Remove</span>
    </button>
  </div>
}

export const Tag = ({ el, onChange }: CustomFormItemProps) => {
  const { id, list, allowNew, placeholder, checkBoolUpper } = el;

  const [value, setValue] = useState<string[]>([]);

  const newChecker = (results: Array<Object | string>, props: any) => {
    const selected = map<{ label: string }, string>(({ label }) => label)(props.selected);

    return selected.indexOf(props.text) < 0;
  }

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

  return <TypeaheadOverride
    id={id}
    multiple
    options={list || []}
    selected={value}
    placeholder={placeholder}
    allowNew={allowNew ? newChecker : false}
    onInputChange={(input: any, e: any) => onChange!(input)}
    labelKey={"label"}
    renderMenuItemChildren={(option: Option, props: any, index: number) =>
      option.icon ? option : <>{option.icon && platformIcon(option.icon)} {option.label}</>
    }
    renderToken={(option: Option, props: any, index: number) => <CustomToken option={option} props={props} index={index} />}
    onChange={onValChange}
  />
}