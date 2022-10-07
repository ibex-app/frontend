import React from 'react';
import { Spin } from 'antd';

export const Loader = ({ isInProgress }: { isInProgress?: boolean }) =>
  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
    {isInProgress ? 'Ibex is collecting data, please standby' : 'Loading'} <Spin />
  </div>