import { fold, getOrElse } from "fp-ts/lib/Either";
import { lensPath, pipe, set } from "ramda";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { FormComponent } from "../../antd/Form";
import { Get, Response } from "../../shared/Http";
import { useNavWithQuery, useDebounce } from "../../shared/Utils";
import { TaxonomyResults } from "./Results";
import { match } from 'ts-pattern';
import { finalizeForm } from "../../shared/Utils/Taxonomy";
import { Steps } from "antd";
export const { data }: { data: any[] } = require('../../data/taxonomy/taxonomy.json');

const accountLens = lensPath([1, 'children', 1, 'children', 0, 'list']);
const accountFormLens = lensPath(["form2", "accounts"]);
const accountsSelectedLens = lensPath([1, 'children', 1, 'children', 0, 'selected']);
const keywordsLens = lensPath([1, 'children', 0, 'children', 0, 'selected']);
const keywordsFormLens = lensPath(["form2", "search_terms"]);

const { Step } = Steps;

export function Taxonomy() {
  const location = useLocation();
  const navWithQuery = useNavWithQuery();
  const [formData, setFormData] = useState(data);
  const [form, setForm] = useState<any>({});
  const [platforms, setPlatforms] = useState([]);

  const [accountSubstr, setAccountSubstr] = useState("");
  const [accountSuggestions, setAccountSuggestions] = useState<any[]>();
  const substring = useDebounce(accountSubstr, 500);
  const monitor_id = useMemo(() => new URLSearchParams(location.search).get('monitor_id') || "", [location.search]);

  useEffect(() => {
    console.log(formData);
  }, [formData])

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

    if (accounts && typeof accounts[0] === 'string') {
      setAccountSubstr(accounts[0]);
      return;
    }

    if (platforms) setPlatforms(platforms);

    setForm({ ...form, [formId]: { ...form[formId], ...changed } });
  }

  useEffect(() => accountSuggestions && pipe(
    set(accountLens, accountSuggestions),
    setFormData
  )(formData), [accountSuggestions]);

  useEffect(() => { if (!form.form1) navWithQuery('/taxonomy/init') }, []);

  // if platforms or debounced substring from account changes, we suggest new options
  useEffect(() => {
    if (substring) Get<Array<{ title: string }>>('search_account', { platforms, substring }).then(
      fold(() => { }, setAccountSuggestions)
    );
  }, [platforms, substring]);

  const updateMonitor = () => Get<Response<any>>('update_monitor', { monitor_id, ...finalizeForm(form) })
    .then(fold(() => { }, () => navWithQuery('/taxonomy/results')));

  const onSubmit = (formData: any, values: any) =>
    match(formData.id)
      .with("form1", () => navWithQuery(formData.redirect))
      .with("form2", () => {
        if (monitor_id) {
          updateMonitor();
          return;
        }

        const createMonitor = Get('create_monitor', finalizeForm(form));
        createMonitor.then((_data: Response<any>) => {
          const { _id }: any = getOrElse(() => [])(_data);
          Get('collect_sample', { id: _id }).then(() => {
            navWithQuery(`${formData.redirect}?monitor_id=${_id}`);
          });
        });
      })
      .otherwise(() => "Invalid form data");

  const currentStep = useMemo(() => match(location.pathname)
    .with('/taxonomy/init', () => 0)
    .with('/taxonomy/params', () => 1)
    .otherwise(() => 2), [location]);

  const onStepsChange = (step: number) => {
    match(step)
      .with(0, () => navWithQuery('/taxonomy/init'))
      .with(1, () => {
        const isFirstFormValid = !!form?.form1 && Object.keys(form.form1).reduce((acc, key) => acc && !!form.form1[key], true);
        if (!isFirstFormValid) return;
        navWithQuery('/taxonomy/params');
      })
      .otherwise(() => monitor_id && updateMonitor());
  }

  return (
    <>
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
      <Steps current={currentStep} style={{ padding: '0 50px' }} onChange={onStepsChange}>
        <Step />
        <Step />
        <Step />
      </Steps>
    </>
  )
}