import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { data, initForm, TaxonomyContext } from "./Context";
import { TaxonomyResults } from "./Results";
import { TaxonomyForm } from "./TaxonomyForm";

export function Taxonomy() {
  const update = (el: any) => (value: any) => {
    setState(Object.keys(value).includes('date')
      ? { ...form, ...value.date }
      : { ...form, [el.id]: value });
    return null;
  }

  const [form, setState] = useState(initForm);

  return (
    <TaxonomyContext.Provider value={{ form, update }}>
      <Routes>
        <Route path="/" element={<Navigate to="/taxonomy/init" />}></Route>
        {data.map((item, i) => <Route key={`${item.id}_${i}`} path={item.path} element={
          <TaxonomyForm formData={item} />
        } />)}
        <Route path="/results" element={<TaxonomyResults></TaxonomyResults>}></Route>
      </Routes>
    </TaxonomyContext.Provider>
  )
}