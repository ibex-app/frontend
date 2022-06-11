import { fold, getOrElse } from "fp-ts/lib/Either";
import { lensPath, map, pipe, set } from "ramda";
import { useEffect, useState } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { FormComponent } from "../../antd/Form";
import { Get, Response } from "../../shared/Http";
import { useDebounce } from "../../shared/Utils";
import { TaxonomyResults } from "./Results";
import { match } from 'ts-pattern';
import { finalizeForm } from "../../shared/Utils/Taxonomy";
export const { data }: { data: any[] } = require('../../data/taxonomy/taxonomy.json');

const accountLens = lensPath([1, 'children', 3, 'children', 0, 'list']);
const accountFormLens = lensPath(["form2", "accounts"]);
const accountsSelectedLens = lensPath([1, 'children', 3, 'children', 0, 'selected']);
const keywordsLens = lensPath([1, 'children', 0, 'children', 0, 'selected']);
const keywordsFormLens = lensPath(["form2", "search_terms"]);

export function Taxonomy() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(data);
  const [form, setForm] = useState<any>({});
  const [platforms, setPlatforms] = useState([]);

  const [accountSubstr, setAccountSubstr] = useState("");
  const [accountSuggestions, setAccountSuggestions] = useState<any[]>();
  const substring = useDebounce(accountSubstr, 500);

  const onValuesChange = (changed: any, values: any, formId: string) => {
    const { accounts, platforms, search_terms_upload, accounts_upload } = changed;

    if (search_terms_upload) {
      pipe(set(keywordsLens, search_terms_upload), setFormData)(formData);
      pipe(set(keywordsFormLens, search_terms_upload), setForm)(form);
      return;
    }

    if (accounts_upload) {
      pipe(set(accountsSelectedLens, accounts_upload), setFormData)(formData);
      pipe(set(accountFormLens, accounts_upload), setForm)(form);
      return;
    }

    if (accounts && typeof accounts === 'string') {
      setAccountSubstr(accounts);
      return;
    }

    if (platforms) setPlatforms(platforms);

    setForm({ ...form, [formId]: { ...form[formId], ...changed } });
  }

  useEffect(() => {
    if (accountSuggestions) pipe(set(accountLens, accountSuggestions), setFormData)(formData);
  }, [accountSuggestions]);

  // if platforms or debounced substring from account changes, we suggest new options
  useEffect(() => {
    if (substring) Get<Array<{ title: string }>>('search_account', { platforms, substring }).then(
      fold(() => { }, setAccountSuggestions)
    );
  }, [platforms, substring]);

  const onSubmit = (formData: any, values: any) =>
    match(formData.id)
      .with("form1", () => navigate(formData.redirect))
      .with("form2", () => {
        const createMonitor = Get('create_monitor', finalizeForm(form));
        createMonitor.then((_data: Response<any>) => {
          const { _id }: any = getOrElse(() => [])(_data);
          Get('collect_sample', { id: _id }).then(() => {
            navigate(`${formData.redirect}?monitor_id=${_id}`);
          });
        });
      })
      .otherwise(() => "Invalid form data");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/taxonomy/init" />}></Route>
      {formData.map((item, i) => <Route key={`${item.id}_${i}`} path={item.path} element={
        <FormComponent
          onValuesChange={(changed: any, values: any) => onValuesChange(changed, values, item.id)}
          formData={item}
          formValues={form}
          onSubmit={(values: any) => onSubmit(item, values)} />
      } />)}
      <Route path="/results" element={<TaxonomyResults />}></Route>
    </Routes>
  )
}