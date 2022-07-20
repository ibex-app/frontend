import { FormElement } from '../../types/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { getElem } from '../../antd/utils/ElementGetter';
import { Form, Space } from 'antd';
import { pipe } from 'ramda';
import { transform_filters_to_request } from '../../shared/Http';

type Input = {
  data: any;
  onChange: (filter: Filter) => void;
}

export function Filter({ data, onChange }: Input) {
  const setFilters = pipe(
    transform_filters_to_request,
    onChange
  )

  return (
    <Form className="top-filters" layout="vertical" onValuesChange={(changed, values) => setFilters(values)}>
      {data.map(getElem)}
    </Form>
  );
}
