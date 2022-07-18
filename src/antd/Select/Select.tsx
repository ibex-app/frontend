import { Typeahead } from "react-bootstrap-typeahead"
import { FormElement, Option } from "../../types/form"
import { last, map, pipe } from "ramda";

import './Select.css';
import { useEffect, useState } from "react";
import { filterHasOperator, filterOperatorUpper, platformIcon } from "../../shared/Utils";

type Value = Option[];

type CustomFormItemProps = {
  el: FormElement,
  value?: any;
  onChange?: (val: Value) => void
};

type CustomTokenInput = {
  option: Option,
  index: number,
  onRemove: (index: number) => void
}

const TypeaheadOverride: any = Typeahead;

const CustomToken = ({ option, index, onRemove }: CustomTokenInput) => {
  return <div className="rbt-token rbt-token-removeable" tabIndex={index}>
    {option.icon ? <>{option.icon && platformIcon(option.icon)} {option.label}</> : option.label || option}
    <button tabIndex={-1} aria-label="Remove" className="close rbt-close rbt-token-remove-button" type="button" onClick={() => {
      onRemove(index);
    }}>
      <span aria-hidden="true">×</span>
      <span className="sr-only visually-hidden">Remove</span>
    </button>
  </div>
}

export const Tag = ({ el, onChange }: CustomFormItemProps) => {
  const { id, list, allowNew, placeholder, checkBoolUpper, selected } = el;

  const [value, setValue] = useState<Option[]>([]);

  const newChecker = (results: Array<Object | string>, props: any) => {
    const selected = map<{ label: string }, string>(({ label }) => label)(props.selected);
    // TODO filter accounts by platform+title
    return selected.indexOf(props.text) < 0;
  }

  const onValChange = (val: Value) => {
    if (checkBoolUpper && val.length) {
      const lastKeyword = last(val as any[])?.label;
      val[val.length - 1].label = pipe(filterHasOperator, filterOperatorUpper)(lastKeyword);
    }

    setValue(val);
    onChange!(val);
  }

  const onRemove = (index: number) => {
    const newVal = value.filter((val, i) => index !== i);
    setValue(newVal);
    onChange!(newVal);
  }


  useEffect(() => {
    selected && setValue(selected);
  }, [selected])

  return <TypeaheadOverride
    id={id}
    multiple
    options={list || []}
    selected={value}
    placeholder={placeholder}
    allowNew={allowNew ? newChecker : false}
    onInputChange={(input: any, e: any) => onChange!([input])}
    labelKey={"label"}
    renderMenuItemChildren={(option: Option, props: any, index: number) => {
      return option.icon ? <>{option.icon && platformIcon(option.icon)} <span>{option.label}</span></> : option.label || option
    }}
    renderToken={(option: Option, props: any, index: number) =>
      <CustomToken option={option} index={index} onRemove={onRemove} />
    }
    onChange={onValChange}
  />
}