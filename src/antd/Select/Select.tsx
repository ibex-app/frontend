import { Typeahead } from "react-bootstrap-typeahead"
import { FormElement, Option } from "../../types/form"
import { last, map, pipe } from "ramda";

import './Select.css';
import { useCallback, useEffect, useRef, useState } from "react";
import { filterHasOperator, filterOperatorUpper, platformIcon, useDebounce } from "../../shared/Utils";
import { useDynamicReqState } from '../../state/useDynamicReqState';

type Value = Option[];

type CustomFormItemProps = {
  el: FormElement,
  value?: any;
  requestData?: any;
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
    {!!option.render && option.render}
    {!option.render && (option.icon ? <>{option.icon && platformIcon(option.icon)} {option.label}</> : option.label || option)}
    <button tabIndex={-1} aria-label="Remove" className="close rbt-close rbt-token-remove-button" type="button" onClick={() => {
      onRemove(index);
    }}>
      <span aria-hidden="true">×</span>
      <span className="sr-only visually-hidden">Remove</span>
    </button>
  </div>
}

export const Tag = ({ el, onChange, value }: CustomFormItemProps) => {
  const { id, list, allowNew, placeholder, checkBoolUpper, selected, requestData } = el;

  const [suggestions, setSuggestions] = useState<Option[]>(list || []);
  const [val, setValue] = useState<Option[]>(value || selected || []);
  const [userValue, setUserValue] = useState<string>('');
  const ref = useRef<any>();

  const userValueDebounced = useDebounce(userValue, 500);

  const { data } = useDynamicReqState<Option[]>(requestData || '', {
    substring: userValueDebounced,
    platforms: []
  });
  useEffect(() => data && setSuggestions(data), [data]);

  const newChecker = (newVal: string, props: any) => {
    const selected = map<{ label: string }, string>(({ label }) => label)(props.selected);
    // TODO filter accounts by platform+title
    return selected.indexOf(props.text || newVal) < 0;
  }

  const onChange_ = (value: any) => {
    setUserValue(value);
    onChange!([value]);
  }

  const onBlur = useCallback(() => userValue && allowNew && newChecker(userValue, { selected: val }) && onValChange([...val, { label: userValue }]), [userValue, value]);

  const onValChange = (val: Value) => {
    if (checkBoolUpper && val.length) {
      const lastKeyword = last(val as any[])?.label;
      val[val.length - 1].label = pipe(filterHasOperator, filterOperatorUpper)(lastKeyword);
    }

    ref.current.state.text = "";
    setUserValue('');
    setValue(val);
    onChange!(val);
  }

  const onRemove = useCallback((index: number) => {
    const newVal = val.filter((_: any, i: number) => index !== i);
    setValue(newVal);
    onChange!(newVal);
  }, [val]);


  useEffect(() => {
    selected && setValue(selected);
  }, [selected])

  return <TypeaheadOverride
    id={id}
    ref={ref}
    multiple
    options={suggestions}
    selected={val}
    placeholder={placeholder}
    allowNew={allowNew ? newChecker : false}
    onInputChange={(input: any, e: any) => onChange_(input)}
    labelKey={"label"}
    onBlur={onBlur}
    emptyLabel={requestData && !data && userValue ? "Loading..." : "No results found."}
    renderMenuItemChildren={(option: Option, props: any, index: number) => {
      if (option.render) return option.render;
      return option.icon ? <>{option.icon && platformIcon(option.icon)} <span>{option.label}</span></> : option.label || option
    }}
    renderToken={(option: Option, props: any, index: number) =>
      <CustomToken option={option} index={index} onRemove={onRemove} />
    }
    onChange={onValChange}
  />
}