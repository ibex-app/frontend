import { Button, Card, Col, List, Modal, Row, Space } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import classes from './MonitorList.module.css'
import { PieChartOutlined, CopyOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { Get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { Monitor, MonitorRespose } from '../../types/taxonomy';
import { Link, useNavigate } from 'react-router-dom';
import { MonitorBlock } from '../../components/monitor/Monitor';
import Spinner from '../../antd/Spinner/Spinner';


const MonitorList: React.FC = () => {
  const [data, setData] = useState<MonitorRespose[]>([]);
  const [fetching, setFetching]: any = useState(true);
  const [refetch, setRefetch]: any = useState(true);
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);

  const [monitorId, setMonitorId] = useState("");

  const navigate = useNavigate();
  
  const showDeleteModal = (monitorItem: Monitor) => {
    console.log(monitorItem)
    setMonitorId(monitorItem?._id);
    setDeleteModalVisible(true);
  };
  
  const hideDeleteModal = () => {
    setMonitorId("");
    setDeleteModalVisible(false);
  };

  const deleteItemHandler = useCallback(() => {
    hideDeleteModal()
    Get('delete_monitor', { id: monitorId }).then((_data: Response<any>) => {
      setRefetch(1)
    });
  }, [monitorId]);
  
  const showDuplicateModal = (monitorItem: Monitor) => {
    setMonitorId(monitorItem?._id);
    setDuplicateModalVisible(true);
  };
  
  const hideDuplicateModal = () => {
    setMonitorId("");
    setDuplicateModalVisible(false);
  };
  
  const duplicateItemHandler = useCallback(
    () => {
      const fetchData = Get('duplicate_monitor', { monitor_id: monitorId });

      fetchData.then((_data: Response<any>) => {
        let maybeData = E.getOrElse(() => [])(_data)
        if (!maybeData || !maybeData.forEach) return
        console.log(maybeData);
      });
    }, [monitorId]
  );

  useEffect(() => {
    // if(data?.length){
      setFetching(false)
    // }
  },[data])

  useEffect(() => {
    setFetching(true)
    Get<MonitorRespose[]>('get_monitors', { tag: '*' })
        .then(E.fold(console.error, setData));
  }, [refetch])

  const extraButtons = {
    showDuplicateModal: showDuplicateModal, 
    showDeleteModal: showDeleteModal
  }
  // <Button  onClick={() => showDuplicateModal(monitorItem)}><CopyOutlined key="duplicate" /> Duplicate</Button>,
  // <Button  onClick={() => showDeleteModal(monitorItem)}><DeleteOutlined key="delete" /> Delete</Button>]
  return (
    <div>
      <div className="tax-title-line">
        <div className="tax-mid">Monitors <Link to='/taxonomy/init'>              <Button>Create</Button>            </Link></div>
        {/* <div className="tax-mid">Monitors  </div> */}

      </div>
      <Row justify="center" className="tax-scroll monitor-list">
        <Space className="tax-mid mt-20" direction="vertical" size="middle">
        
      {
        deleteModalVisible && (
          <>
              <Modal
                title="Modal"
                visible={deleteModalVisible}
                onOk={deleteItemHandler}
                onCancel={hideDeleteModal}
                okText="Ok"
                cancelText="Cancel"
              >
                <p>Confirm delete action for monitor {monitorId}?</p>
            </Modal>
          </>
        )
      }

      {
        duplicateModalVisible && (
          <>
              <Modal
                title="Modal"
                visible={duplicateModalVisible}
                onOk={hideDuplicateModal}
                onCancel={hideDuplicateModal}
                okText="Ok"
                cancelText="Cancel"
              >
                <p>Confirm duplicate action for monitor {monitorId}?</p>
            </Modal>
          </>
        )
      }
      
      <List grid={{ gutter: 16, column: 4 }}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {
          fetching 
            ? <span>Loading... <Spinner /></span>
            : data.map((monitorItem: MonitorRespose) => <Col className="gutter-row" span={24}>
                    <MonitorBlock extraButtons={extraButtons} monitorData={monitorItem}></MonitorBlock>
                  </Col>)
        }
        </Row>
      </List>
      </Space>
      </Row>
    </div>
  )
}

export default MonitorList;