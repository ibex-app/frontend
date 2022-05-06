import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { FormComponent } from "../../antd/Form";
import { TaxonomyResults } from "./Results";
export const { data }: { data: any[] } = require('../../data/taxonomy.json');

export function Taxonomy() {

  const [form, setForm] = useState({});

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/taxonomy/init" />}></Route>
      {data.map((item, i) => <Route key={`${item.id}_${i}`} path={item.path} element={
        <FormComponent store={setForm} formData={item} formValues={form} />
      } />)}
      <Route path="/results" element={<TaxonomyResults form={form} />}></Route>
    </Routes>
  )
}