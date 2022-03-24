import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { TaxonomyContext } from "./Context";
import { TaxonomyForm } from "./TaxonomyForm";

export function Taxonomy() {
  const { data }: { data: any[] } = require('../../data/taxonomy.json');

  const defaultData = data.reduce((acc, { data }) => {
    const items = data.reduce((acc: any, { id, value }: any) => ({ ...acc, [id]: value }), {});
    return { ...acc, ...items };
  }, {});

  const update = (el: any) => (value: any) => {
    setState({ ...form, [el.id]: value });
    return null;
  }

  const [form, setState] = useState(defaultData);

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <TaxonomyContext.Provider value={{ form, update }}>
      <Routes>
        <Route path="/" element={<Navigate to="/taxonomy/init" />}></Route>
        {data.map(item => <Route path={item.path} element={<TaxonomyForm formData={item} />} />)}
      </Routes>
    </TaxonomyContext.Provider>
  )
}