import React, { createContext } from "react";
import { TaxonomyForm } from "../../types/form";

export const { data }: { data: any[] } = require('../../data/taxonomy.json');

export const initForm = data.reduce((acc, { data }) => {
  const items = data.reduce((acc: any, { id, value }: any) => {
    if (id != "date") return { ...acc, [id]: value };
  }, {});
  
  return { ...acc, ...items };
}, {});

export const TaxonomyContext: React.Context<{
  form: TaxonomyForm,
  update: (el: any) => (value: any) => null
}> = createContext({
  form: initForm,
  update: (el: any) => (value: any) => null
});

