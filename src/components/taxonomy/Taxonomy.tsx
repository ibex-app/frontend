import { getOrElse } from "fp-ts/lib/Either";
import { lensPath, pipe, set } from "ramda";
import { useEffect, useMemo, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { FormComponent } from "../../antd/Form";
import { Get, Response } from "../../shared/Http";
import { useNavWithQuery } from "../../shared/Utils";
import { TaxonomyResults } from "./Results";
import { match } from 'ts-pattern';
import { finalizeForm } from "../../shared/Utils/Taxonomy";
import { Steps } from "antd";
import TaxonomyDataCollection from "./TaxonomyProgress";
import { useUpdateMonitorMutation } from '../../state/useUpdateMonitorMutation';
export const { data }: { data: any[] } = require('../../data/taxonomy/taxonomy.json');

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
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const monitor_id = useMemo(() => new URLSearchParams(location.search).get('monitor_id') || "", [location.search]);
  const { mutateAsync: _updateMonitor } = useUpdateMonitorMutation(monitor_id);

  const onValuesChange = (changed: any, values: any, formId: string) => {
    const { platforms, search_terms_upload, accounts_upload } = changed;

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
    setForm({ ...form, [formId]: { ...form[formId], ...changed } });
  }

  useEffect(() => { if (!form.form1 && !monitor_id) navWithQuery('/taxonomy/init') }, []);

  const updateMonitor = () => _updateMonitor(finalizeForm(form)).then(() => navWithQuery('/taxonomy/results'));

  const onSubmit = (formData: any, values: any) =>
    match(formData.id)
      .with("form1", () => navWithQuery(formData.redirect))
      .with("form2", () => {
        setSubmitDisabled(true);
        if (monitor_id) {
          updateMonitor().then(() => setSubmitDisabled(false));
          return;
        }

        const createMonitor = Get('create_monitor', finalizeForm(form));
        createMonitor.then((_data: Response<any>) => {
          const { _id }: any = getOrElse(() => [])(_data);
          Get('collect_sample', { id: _id }).then(() => {
            setSubmitDisabled(false)
            navWithQuery(`${formData.redirect}?monitor_id=${_id}`);
          });
        });
      })
      .otherwise(() => "Invalid form data");

  const currentStep = useMemo(() => match(location.pathname)
    .with('/taxonomy/init', () => 0)
    .with('/taxonomy/params', () => 1)
    .with('/taxonomy/results', () => 2)
    .otherwise(() => 3), [location]);

  const onStepsChange = (step: number) => {
    match(step)
      .with(0, () => navWithQuery('/taxonomy/init'))
      .with(1, () => {
        const isFirstFormValid = !!form?.form1 && Object.keys(form.form1).reduce((acc, key) => acc && !!form.form1[key], true);
        if (!isFirstFormValid) return;
        navWithQuery('/taxonomy/params');
      })
      .with(2, () => monitor_id && updateMonitor())
      .otherwise(() => navWithQuery('/taxonomy/data-collection'));
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
            onSubmit={(values: any) => onSubmit(item, values)}
            submitDisabled={submitDisabled}
          />
        } />)}
        <Route path="/results" element={<TaxonomyResults />}></Route>
        <Route path="/data-collection" element={<TaxonomyDataCollection />}></Route>
      </Routes>
      <Steps current={currentStep} style={{ padding: '0 50px' }} onChange={onStepsChange}>
        <Step />
        <Step />
        <Step />
        <Step />
      </Steps>
    </>
  )
}