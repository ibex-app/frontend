import { Avatar, Button, Card, Col, Modal, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react'
import classes from './MonitorList.module.css'
import { BarsOutlined, CopyOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { Get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { Monitor } from '../../types/taxonomy';
import { duplicate } from 'fp-ts/lib/ReadonlyNonEmptyArray';

const MonitorList: React.FC = () => {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);

  const [monitorId, setMonitorId] = useState("");
  // const [duplicateText, setDuplicateText] = useState("");
  
  const showDeleteModal = (monitorItem: Monitor) => {
    console.log(monitorItem)
    setMonitorId(monitorItem?._id);
    setDeleteModalVisible(true);
  };
  
  const hideDeleteModal = () => {
    setMonitorId("");
    setDeleteModalVisible(false);
  };
  
  const showDuplicateModal = (monitorItem: Monitor) => {
    console.log(monitorItem)
    setMonitorId(monitorItem?._id);
    setDuplicateModalVisible(true);
  };
  
  const hideDuplicateModal = () => {
    setMonitorId("");
    setDuplicateModalVisible(false);
  };

  useEffect(() => {
    const fetchData = Get('get_monitors', { tag: '*' });

    fetchData.then((_data: Response<any>) => {
      let maybeData = E.getOrElse(() => [])(_data)
      if (!maybeData || !maybeData.forEach) return
      maybeData.forEach((k: any) => k.key = k._id)
      setData(maybeData)
      setFetching(false)
    });
  }, [])

  // სახელი
  // - აღწერა
  // - დროის ინტერვალი
  // - პლატფორმები
  // - ანგარიშები accounts ან საძიებო სიტყვები search_terms
  // - summary ან taxomony გვერდზე გადასვლის ღილაკი
  // - duplicate ღილაკი, რომელიც api - duplicate_monitor-ს გადასცემს monitor_id-ს  და მიიღებს ახალ დამატებულ მონიტორს და დაამატებს სიაში
  // - delete ღილაკი, რომელიც გამოაჩენს (ant) confirm popup-ს ტექსტით: 'Confirm delete action for monitor {monitor name}', და დასტურის შემთხვევაში api delete_monitor-ს გადასცემს წასაშლელ monitor_id-ს
 

  return (
    <div className={classes.monitorListContainer}>
      <h1>Monitors List</h1>

      {
        deleteModalVisible && (
          <>
              <Modal
                title="Modal"
                visible={deleteModalVisible}
                onOk={hideDeleteModal}
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

      <> 
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
                      style={{ width: 300, marginTop: 16 }}
                      actions={[
                        <DeleteOutlined key="delete" onClick={() => showDeleteModal(monitorItem)} />,
                        <CopyOutlined key="duplicate" onClick={() => showDuplicateModal(monitorItem)} />,
                        <BarsOutlined key="summary" />,
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
            </Row>
          ) : "Loading"
        }
      </>
    </div>
  )
}

export default MonitorList;