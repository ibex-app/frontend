import { createContext } from "react";

export const TaxonomyContext = createContext({
  form: {},
  update: () => console.log("Use this to update data")
})