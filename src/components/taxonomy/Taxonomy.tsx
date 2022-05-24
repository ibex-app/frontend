import { fold } from "fp-ts/lib/Either";
import { lensPath, map, pipe, set, view } from "ramda";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { FormComponent } from "../../antd/Form";
import { Get } from "../../shared/Http";
import { useDebounce } from "../../shared/Utils";
import { TaxonomyResults } from "./Results";
export const { data }: { data: any[] } = require('../../data/taxonomy/taxonomy.json');

const accountLens = lensPath([1, 'children', 3, 'children', 0, 'list']);
const accountsSelectedLens = lensPath([1, 'children', 3, 'children', 0, 'selected']);
const keywordsLens = lensPath([1, 'children', 0, 'children', 0, 'selected']);

export function Taxonomy() {
  const [formData, setFormData] = useState(data);

  const [form, setForm] = useState({});

  const [platforms, setPlatforms] = useState([]);

  const [accountSubstr, setAccountSubstr] = useState("");
  const [accountSuggestions, setAccountSuggestions] = useState<string[]>();
  const substring = useDebounce(accountSubstr, 500);

  const onValuesChange = (changed: any, values: any) => {
    const { accounts, platforms, search_terms_upload, accounts_upload } = changed;

    if (search_terms_upload) {
      pipe(
        set(keywordsLens, search_terms_upload),
        setFormData
      )(formData)
    }

    if (accounts_upload) {
      pipe(
        set(accountsSelectedLens, accounts_upload),
        setFormData
      )(formData)
    }

    if (accounts && typeof accounts === 'string') {
      setAccountSubstr(accounts);
      return;
    }

    if (platforms) setPlatforms(platforms);

    setForm({ ...values });
  }

  useEffect(() => {
    if (accountSuggestions) pipe(
      set(accountLens, accountSuggestions),
      setFormData
    )(formData);
  }, [accountSuggestions])

  // if platforms or debounced substring from account changes, we suggest new options
  useEffect(() => {
    if (substring) Get<string[]>('search_account', { platforms, substring }).then(
      fold(() => { }, setAccountSuggestions)
    );
  }, [platforms, substring]);


  return (
    <Routes>
      <Route path="/" element={<Navigate to="/taxonomy/init" />}></Route>
      {formData.map((item, i) => <Route key={`${item.id}_${i}`} path={item.path} element={
        <FormComponent onValuesChange={onValuesChange} formData={item} formValues={form} />
      } />)}
      <Route path="/results" element={<TaxonomyResults />}></Route>
    </Routes>
  )
}