import { getElem } from '../../antd/utils/ElementGetter';
import { Form, Row, Col } from 'antd';
import { pipe, map } from 'ramda';
import { transform_filters_to_request } from '../../shared/Http';
import { useEffect, useMemo } from 'react';
import { FormElement } from '../../types/form';

type Input = {
  data: FormElement[],
  onChange: (filter: Filter) => void;
}

export function Filter({ data, onChange }: Input) {
  const setValues = useMemo(() => pipe(
    transform_filters_to_request,
    onChange
  ), []);

  useEffect(() => {
    data?.length ? pipe(
      map<FormElement, any>(({ id, selected }) => transform_filters_to_request({ [id]: selected })),
      (val) => Object.assign({}, ...val),
      onChange
    )(data) : onChange({});
  }, [data, onChange]);

  return (
    <Form className="top-filters tax-title-line" layout="vertical" onValuesChange={(changed, values) => setValues(values)}>
      {/* <Row align="middle">
      <Col span={18} offset={3} className="results-cont mt-20">
      </Col>
      </Row> */}
      {/* <div className=""> */}
        <div className="tax-mid">
      
          {data.map(getElem)}
          
          </div>
      {/* </div> */}
    </Form>
  );
}
