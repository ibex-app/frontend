import { getElem } from '../../antd/utils/ElementGetter';
import { Form } from 'antd';
import { pipe } from 'ramda';
import { transform_filters_to_request } from '../../shared/Http';
import { useEffect, useMemo } from 'react';
import { FormElement } from '../../types/form';

type Input = {
  data: FormElement[],
  onChange: (filter: Filter) => void;
}

export function Filter({ data, onChange }: Input) {
  const setFilters = useMemo(() => pipe(
    transform_filters_to_request,
    onChange
  ), [onChange]);

  useEffect(() => {
    data.forEach(({ id, selected }) => setFilters({ [id]: selected }))
  }, [data, setFilters])

  return (
    <Form className="top-filters" layout="vertical" onValuesChange={(changed, values) => setFilters(values)}>
      {data.map(getElem)}
    </Form>
  );
}
