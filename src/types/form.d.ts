import { Rule } from "antd/lib/form";
import { string } from "fp-ts";

interface FormCommon {
  id: number,
  type: string;
  title?: string;
  children?: FormElement[];
  value?: any;
  required?: boolean;
  rules?: Rule[];
  tip?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface FormItemGroup {
  label: string;
  children: FormElement[];
}

interface Checkbox {
  checked: boolean
}

interface Tag {
  allowNew?: boolean,
  list: string[]
}

export type FormElement =
  FormCommon & (Checkbox & Tag & FormItemGroup);

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