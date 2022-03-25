import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { TaxonomyContext } from "./Context";
import { TaxonomyResults } from "./Results";
import { TaxonomyForm } from "./TaxonomyForm";

export function Taxonomy() {
  const { data }: { data: any[] } = require('../../data/taxonomy.json');

  const defaultData = data.reduce((acc, { data }) => {
    const items = data.reduce((acc: any, { id, value }: any) => {
      if (id != "date") return { ...acc, [id]: value };
    }, {});

    return { ...acc, ...items };
  }, {});

  const update = (el: any) => (value: any) => {
    setState(Object.keys(value).includes('date')
      ? { ...form, ...value.date }
      : { ...form, [el.id]: value });
    return null;
  }

  const [form, setState] = useState(defaultData);

  return (
    <TaxonomyContext.Provider value={{ form, update }}>
      <Routes>
        <Route path="/" element={<Navigate to="/frontend/taxonomy/init" />}></Route>
        {data.map((item, i) => <Route key={`${item.id}_${i}`} path={item.path} element={
          <TaxonomyForm formData={item} />
        } />)}
        <Route path="/results" element={<TaxonomyResults></TaxonomyResults>}></Route>
      </Routes>
    </TaxonomyContext.Provider>
  )
}