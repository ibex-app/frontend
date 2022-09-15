import { FormElement } from '../../types/form';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { Col, Row, Layout } from 'antd';
import * as E from "fp-ts/lib/Either";

import { faThumbsUp, faFileArrowUp } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { Get, Response } from '../../shared/Http';
import { TaxonomyResponse } from '../../types/common';
import { Monitor, MonitorRespose } from '../../types/taxonomy';
import { useLocation } from 'react-router-dom';

const TaxonomyProgress: React.FC = () => {

  const { Content } = Layout;
  const [taxonomyData, setTaxonomyData] = useState<Response<TaxonomyResponse>>(E.left(Error('Not fetched')));
  const [monitor, setMonitor] = useState<Monitor>();
  const { search } = useLocation();

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);          

  // 1. get_monitor, returns the monitor details like name, date range and used keywords
  // 2. monitor_progress, returns the information about the progress of data collection
  // 'get_monitor', 

  useEffect(() => {
    Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, ({ monitor }) => setMonitor(monitor)));
  }, [monitor_id]);

  console.log(monitor);

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
  // )(Get<HitsCountResponse>('get_hits_count', { id: monitor_id }));

  return (
    <>
      <div className='data-collection-content'>
          <Content>
            <h1>Data Collection Step - 4</h1>
            <h2>Posts Colecting for monitor: "..."</h2>
            <Row>
              <Col>
                <br />
                Esitmated
              </Col>
            </Row>

            <Row>
              <Col>
                Date - ...
              </Col>
            </Row>

            <Row>
              <Col span={4}>
                Youtube stats
              </Col>

              <Col span={20}>
                Render Youtube Bar ...
              </Col>
            </Row>

            <Row>
              <Col span={4}>
                Youtube stats
              </Col>

              <Col span={20}>
                Render Youtube Bar ...
              </Col>
            </Row>

            <Row>
              <Col span={4}>
                Youtube stats
              </Col>

              <Col span={20}>
                Render Youtube Bar ...
              </Col>
            </Row>
        </Content>
      </div>
    </>
  );
}

export default TaxonomyProgress;