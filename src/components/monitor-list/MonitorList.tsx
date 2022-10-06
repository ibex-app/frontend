import { Avatar, Card, Col, Row, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react'
import classes from './MonitorList.module.css'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { Get, Response } from '../../shared/Http';
import * as E from "fp-ts/lib/Either";
import { Monitor } from '../../types/taxonomy';

const MonitorList: React.FC = () => {
  const [data, setData]: any = useState([]);
  const [fetching, setFetching]: any = useState(true);

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
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                      ]}
                    >
                      <Meta
                        // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
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