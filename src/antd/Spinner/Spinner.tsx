import {Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Spiiner: React.FC = () => <Spin indicator={antIcon} />;

export default Spiiner;