import { Rule } from "antd/lib/form";
import { string } from "fp-ts";

// export interface FormElementItem {
//   id: number | string;
//   component: string;  // 'input' | 'typeahead';
//   type: string; // 'text' | 'password' | 'input'
//   name: string;
//   label: string;
//   value: any; // string | number | any[]
//   typeahead?: any[];
//   onChange?: (event: FormEvent<HTMLFormElement>) => void;
// };

export interface FilterElement {
  id: number,
  type: string;
  label: string;
  title?: string;
  value: any;
  values: any[];
  tip?: string;
  allowNew?: boolean;
  placeHolder?: string;
  onChange?: (event: FormEvent<HTMLFormElement>) => void;
  children?: FilterElement[],
  rules?: Rule[],
  disabled?: boolean,
  checked?: boolean
}

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