import { Route, Routes } from "react-router-dom";
import { TaxonomyContext } from "./Context";
import { TaxonomyForm } from "./TaxonomyForm";
import { TaxonomyParams } from "./TaxonomyParams";

export function Taxonomy() {
  const { data }: { data: any[] } = require('../../data/taxonomy.json');

  const defaultData = data.reduce((acc, { data }) => {
    const items = data.reduce((acc: any, { id, value }: any) => ({ ...acc, [id]: value }), {});
    return { ...acc, ...items };
  }, {});

  return (
    <TaxonomyContext.Provider value={defaultData}>
      <Routes>
        {data.map(item => <Route path={item.path} element={<TaxonomyForm formData={item} />} />)}
        {/* <Route path="params" element={<TaxonomyParams />} /> */}
      </Routes>
    </TaxonomyContext.Provider>
  )
}