import { FormElement } from '../../types/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { getElem } from '../../antd/utils/ElementGetter';
import { Form, Space } from 'antd';
import { pipe } from 'ramda';
import { transform_filters_to_request } from '../../shared/Http';

type Input = {
  onChange: (filter: Filter) => void;
}

export function Filter({ onChange }: Input) {
  const { data }: { data: FormElement[] } = require('../../data/filter.json')

  const setFilters = pipe(
    transform_filters_to_request,
    onChange
  )

  return (
    <Form layout="vertical" onValuesChange={(changed, values) => setFilters(values)}>
      <Space wrap>
        {data.map(getElem)}
        <div className="form__item btn-small">
          <FontAwesomeIcon icon={faFileArrowDown} />
        </div>
      </Space>
    </Form>
  );
}
