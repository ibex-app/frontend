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
import { TaxonomyResponse, MonitorProgressResponse, MonitorRespose, Progress, HitsCountResponse } from '../../types/taxonomy';
import { useLocation } from 'react-router-dom';
import ProgressBar from '../../antd/PogressBar/ProgressBar';
import { pipe } from 'ramda';
import { then } from '../../shared/Utils';
import { left, fold } from 'fp-ts/lib/Either';
import { match } from 'ts-pattern';

const TaxonomyProgress: React.FC = () => {

  const { Content } = Layout;
  const [taxonomyData, setTaxonomyData] = useState<Response<TaxonomyResponse>>(E.left(Error('Not fetched')));
  const [monitorData, setMonitorData] = useState<MonitorRespose>();
  const [monitorProgress, setMonitorProgress] = useState<MonitorProgressResponse[]>([] as MonitorProgressResponse[]);
  const { search } = useLocation();
  const [timeout, setTimeout_] = useState<NodeJS.Timeout>();
  const [loading, setLoading] = useState<boolean>(false);

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id') || "", [search]);          

  // 1. get_monitor, returns the monitor details like name, date range and used keywords
  // 2. monitor_progress, returns the information about the progress of data collection
  // 'get_monitor', 

  
  // const monitorArrayData: Progress[] = useMemo(() => {
  //   const monitorArray: any = [];
  //   return monitorArray.splice(0, 0, monitorProgress);
  // }, [monitorProgress]);

  useEffect(() => {
    Get<MonitorRespose>('get_monitor', { id: monitor_id })
      .then(E.fold(console.error, (monitorData: any) => setMonitorData(monitorData)));
  }, [monitor_id]);

  // useEffect(() => {
  //   Get<Progress[]>('monitor_progress', { id: monitor_id })
  //     .then(E.fold(console.error, (data: Progress[] ) => {
  //       setMonitorProgress(data) 
  //       // monitorArrayData.push(data)
  //     }));
  // }, [monitor_id]);


  console.log(monitorProgress);
  // console.log(monitorArrayData);
   
  // todo
  
  // isFull შეიცვალოს -> for platform in responce.items()
  //  responce[platform].finalized_tasks_count == responce[platform].tasks_count
  
  const clearTimeout_ = () => {
    timeout && clearTimeout(timeout);
    setTimeout_(undefined);
  }

  const isFinalized = (res: MonitorProgressResponse) => {
    return Boolean(res.progressItem.finalized_collect_tasks_count === res.progressItem.tasks_count)
  }

  const generateMonitorProgress = (res: MonitorProgressResponse) =>  {
    console.log(res);
    return Object.create(res.progressItem);
  }

  useEffect(() => {
    if (loading) return;
    setLoading(true);

    clearTimeout_();
    const try_ = () => pipe(
      then((fold(
        (err: Error) => console.log('errr', left(err)),
        (res: MonitorProgressResponse) => match(isFinalized(res))
          .with(false, () => {
            console.log("Is Finalized ", isFinalized(res));
            setLoading(false);
            const timeout_: any = setTimeout(() => setTimeout_(timeout_), 1000);
            // setData(generateHitsCountTableData(right(res)))
            return;
          })
          .otherwise(() => {
            clearTimeout_();
            setMonitorProgress(generateMonitorProgress(res));
            console.log("Is Finalized ", isFinalized(res));
            // setPlatforms(generatePlatforms(res));
            // setData(generateHitsCountTableData(right(res)))
          })
      )))
    )(Get<MonitorProgressResponse>('monitor_progress', { id: monitor_id }));

    try_();
    return () => clearTimeout_();
  }, [monitor_id, timeout]);

  // console.log(monitorProgress)

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
              monitorProgress ? monitorProgress.map((item: any, i) => {
                let progressValue: number = 0;
                if (item.progressItem.platform) progressValue = item?.progressItem?.tasks_count / item.progressItem?.finalized_collect_tasks_count * 100;
                
                console.log(`NUmber -> for index ${i}`, progressValue);
                return (
                  <Row key={item.progressItem.platform}>
                    <Col span={4}>
                      { item?.progressItem.platform } stats 
                    </Col>

                    <Col span={20}>
                      { typeof(progressValue) === "number" && progressValue < 100 ? "details being loading..." : "details fetched" } 
                      
                      <ProgressBar percentage={progressValue} showInfo={true} />
                    </Col>
                  </Row>
                )
              }) : <h1>No Data Available</h1>
            }
        </Content>
      </div>
    </>
  );
}

export default TaxonomyProgress;