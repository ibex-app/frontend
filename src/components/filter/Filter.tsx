import React, { useEffect } from 'react';
import { FormElement } from '../../types/form';
import { setGlobalState, useGlobalState } from '../../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import { addParamsToUrl, getFilters } from '../../shared/Utils';
import { getElem } from '../../antd/utils/ElementGetter';
import { Form, Space } from 'antd';

export function Filter() {
  const { data }: { data: FormElement[] } = require('../../data/filter.json')

  const [filters, setFilters] = useGlobalState('filters');

  useEffect(() => setFilters(getFilters(data)), [])

  return (
    <Form layout="vertical">
      <Space wrap>
        {data.map(getElem)}
        <div className="form__item btn-small">
          <FontAwesomeIcon icon={faFileArrowDown} />
        </div>
      </Space>
    </Form>
  );
}
