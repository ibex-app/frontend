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
  value: any;
  values: never[];
  onChange?: (event: FormEvent<HTMLFormElement>) => void;
}

export interface FilterElementInput {
  data: FilterElement
};

export interface FormInput {
  data: FormElementItem[];
  submitter: (event: FormEvent<HTMLFormElement>) => void;
};

export type FormData = Record<string, any>;