import { FormElement } from '../../types/form';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { Col, Row, Layout, Space } from 'antd';
import * as E from "fp-ts/lib/Either";

import { faThumbsUp, faFileArrowUp } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { Get, Response } from '../../shared/Http';
import { TaxonomyResponse } from '../../types/common';
import { Monitor, MonitorRespose } from '../../types/taxonomy';
import { useLocation } from 'react-router-dom';
import ProgressBar from '../../antd/PogressBar/ProgressBar';

const TaxonomyProgress: React.FC = () => {

  const { Content } = Layout;
  const [taxonomyData, setTaxonomyData] = useState<Response<TaxonomyResponse>>(E.left(Error('Not fetched')));
  const [monitorData, setMonitorData] = useState<MonitorRespose>();
  const [monitorProgress, setMonitorProgress] = useState();
  const { search } = useLocation();

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);          

  // 1. get_monitor, returns the monitor details like name, date range and used keywords
  // 2. monitor_progress, returns the information about the progress of data collection
  // 'get_monitor', 

  useEffect(() => {
    Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, (monitorData: any) => setMonitorData(monitorData)));
  }, [monitor_id]);

  useEffect(() => {
    Get('monitor_progress', { id: monitor_id })
      .then(E.fold(console.error, (data: any) => console.log(data)));
  }, [monitor_id]);

  console.log(monitorData);
  // console.log(monitorProgress);

  // useEffect(() => {
  //   Get<Response<TaxonomyResponse>>('get_monitor', E.left('not fetched')).then(
  //     (data) => console.log('data ', data)
  //   )
  // }, [])
   
  // todo
  // const try_ = () => pipe(
  //   then((fold(
  //     (err: Error) => console.log('errr', left(err)),
  //     (res: HitsCountResponse) => match(isFull(res)) 
  
  // isFull შეიცვალოს -> for platform in responce.items()
  //  responce[platform].finalized_tasks_count == responce[platform].tasks_count

  //       .with(false, () => {
  //         setLoading(false);
  //         const timeout_: any = setTimeout(() => setTimeout_(timeout_), 5000); 
  //         setData(generateHitsCountTableData(right(res)))
  //         return;
  //       })
  //       .otherwise(() => {
  //         clearTimeout_();
  //         setPlatforms(generatePlatforms(res));
  //         setData(generateHitsCountTableData(right(res)))
  //       })
  //   )))
  // )(Get<HitsCountResponse>('get_hits_count', { id: monitor_id }));ვ
  // let monitorDate = new Date(monitor?.date_from);

  return (
    <>
      <div className='data-collection-content'>
          <Content>
            <Space size={'middle'} className="taxonomy-header-spacer">
              <h1>Data Collection Step - 4</h1>
              
              <h2>Colecting Posts for { monitorData?.monitor?.title }</h2>
            
              <h2>Description: { monitorData?.monitor?.descr }</h2>
            </Space>

            <Row>
              <Col>
                <br />
                Esitmated
              </Col>
            </Row>

            <Row>
              <Col>
                Date - { monitorData?.monitor?.date_from && monitorData?.monitor?.date_from.toString().slice(0, 10) }
              </Col>
            </Row>

            <Row>
              <Col>
                <h1>Platforms</h1>
              </Col>
            </Row>


            {
              monitorData?.platforms.map(item => (
                <Row>
                  <Col span={4}>
                    { item } stats
                  </Col>

                  <Col span={20}>
                    { item } details being loading...
                    <ProgressBar percentage={50} showInfo={true} />
                  </Col>
                </Row>
              ))
            }
        </Content>
      </div>
    </>
  );
}

export default TaxonomyProgress;