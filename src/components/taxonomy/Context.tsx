import { createContext } from "react";

export const TaxonomyContext = createContext({
  form: {},
  update: (el: any) => (value: any) => null
});

