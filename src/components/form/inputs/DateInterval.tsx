import { useState } from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DatePicker, Row, Space } from 'antd';
import { FilterElement } from '../../../types/form';
import { getElem } from '../../../antd/utils/ElementGetter';

export const DateInterval = ({ children }: { children: FilterElement[] }) => {

  const [isOnGoing, setIsOnGoing] = useState(true);

  return <Space size='middle' direction="vertical">
    <Row className="container align-middle"> On-going monitor?
      <span className={`checkmark ${isOnGoing ? 'checked' : ''}`} onClick={() => setIsOnGoing(!isOnGoing)}></span>
    </Row>
    <Row>
      <Space size='middle'>
        {getElem(children[0])}
        {getElem({ ...children[1], disabled: isOnGoing, placeHolder: isOnGoing ? 'End date not required' : 'Select date' })}
      </Space>
    </Row>
  </Space>
}