import { useState } from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DatePicker, Row, Space } from 'antd';
import { FormElement } from '../types/form';
import { getElem } from './utils/ElementGetter';

export const DateInterval = ({ children }: { children: FormElement[] }) => {

  const [isOnGoing, setIsOnGoing] = useState(true);

  return <Space size='middle' direction="vertical">
    <Row className="container align-middle"> Ongoing monitor?
      <span className={`checkmark ${isOnGoing ? 'checked' : ''}`} onClick={() => setIsOnGoing(!isOnGoing)}></span>
    </Row>
    <Row>
      <Space size='middle' className='date-interval'>
        {getElem(children[0])}
        {getElem({ ...children[1], disabled: isOnGoing, placeholder: isOnGoing ? 'End date not required' : 'Select date' })}
      </Space>
    </Row>
  </Space>
}