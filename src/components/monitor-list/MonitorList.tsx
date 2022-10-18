import { Button, Card, Col, List, Modal, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import classes from './MonitorList.module.css'
import { BarsOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { Delete, Get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { Monitor } from '../../types/taxonomy';
import { useNavigate } from 'react-router-dom';

const MonitorList: React.FC = () => {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  
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
    const fetchData = Delete('delete_monitor', { monitor_id: monitorId });

    fetchData.then((_data: Response<any>) => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData || !maybeData.forEach) return
      console.log(maybeData);
    });
  }, [monitorId]);
  
  const showDuplicateModal = (monitorItem: Monitor) => {
    console.log(monitorItem)
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
    const fetchData = Get('get_monitors', { tag: '*' });

    fetchData.then((_data: Response<any>) => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData || !maybeData.forEach) return
      maybeData.forEach((k: any) => k.key = k._id)
      setData(maybeData)
      setFetching(false)
    });
  }, [duplicateItemHandler, deleteItemHandler])
 
  return (
    <div className={classes.monitorListContainer}>
      <h1>Monitors List</h1>

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

      <List
      grid={{ gutter: 16, column: 4 }}
      >
        {
          !fetching ? (
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {data.map((monitorItem: Monitor) => {
              let monitorDescription = "";
              if (monitorItem.date_to) {
                monitorDescription = monitorItem.descr + ' ' 
                + monitorItem.date_from.toString().slice(0, 10) + monitorItem?.date_to.toString().slice(0, 10)
              }
              else {
                monitorDescription = monitorItem.descr + ' ' 
                + monitorItem.date_from.toString().slice(0, 10) + ""
              }

              return (
                  <Col className="gutter-row" span={6}>
                    <Card
                      // style={{ width: 300, marginTop: 16 }}
                      className="post"
                      actions={[
                        <DeleteOutlined key="delete" onClick={() => showDeleteModal(monitorItem)} />,
                        <CopyOutlined key="duplicate" onClick={() => showDuplicateModal(monitorItem)} />,
                        <BarsOutlined key="summary" onClick={() => navigate("/results/summary?monitor_id=" + monitorItem._id)} />,
                      ]}
                    >
                      <Meta                        
                        title={monitorItem.title}
                        description={monitorDescription}
                      /> 
                    </Card>
                  </Col>
                )
              })}
              <Col className="gutter-row" span={6}>
                    <Card
                      // style={{ width: 300, marginTop: 16 }}
                      className="post"
                      actions={[
                        // <DeleteOutlined key="delete" onClick={() => showDeleteModal(monitorItem)} />,
                        // <CopyOutlined key="duplicate" onClick={() => showDuplicateModal(monitorItem)} />,
                        <BarsOutlined key="summary" onClick={() => navigate("/taxonomy/init")} />,
                      ]}
                    >
                      <Meta                        
                        title='Create new monitor'
                        description='_'
                      /> 
                    </Card>
                  </Col>
            </Row>
          ) : "Loading"
        }
      </List>
    </div>
  )
}

export default MonitorList;