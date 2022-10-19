import { Rule } from "antd/lib/form";
import { string } from "fp-ts";

interface FormCommon {
  id: number | string,
  type: string;
  title?: string;
  children?: FormElement[];
  value?: any;
  required?: boolean;
  rules?: Rule[];
  tip?: string;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: any;
  requestData?: string;
}

interface FormItemGroup {
  label?: string;
  children?: FormElement[];
}

interface Checkbox {
  checked?: boolean
}


export type Option = { label: string, icon?: string };

interface Tag {
  allowNew?: boolean,
  list?: Option[],
  checkBoolUpper?: boolean,
  selected?: Option[]
}

interface Input {
  prefix?: JSX.Element
}

interface Uploader {
  checkboxTitle?: string,
  isOpen?: boolean
}

export type FormElement =
  FormCommon & (Checkbox & Tag & FormItemGroup & Input & Uploader);

export interface FilterElementInput {
  data: FilterElement,
  onChange: (item: any) => any
};

export interface FormInput {
  data: FormElementItem[];
  submitter: (event: FormEvent<HTMLFormElement>) => void;
};

export interface TaxonomyForm {
  title: string,
  descr: string,
  date_from: Date,
  date_to?: Date,
  search_terms: any[],
  accounts: any[],
  platforms?: any[]
}

export type FormData = Record<string, any>;