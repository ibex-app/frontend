import React from 'react'
import { Progress } from 'antd';
import { Col, Row } from 'antd';
import { platformIcon } from '../../shared/Utils';
import { MonitorProgressResponse, MonitorRespose, ProgressItem } from '../../types/taxonomy';


type ProgressBarProps = {
  progress: ProgressItem
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}: ProgressBarProps) => {
  const secondsToHms = (d:number) => {
      d = Number(d);
      var h: number = Math.floor(d / 3600);
      var m: number = Math.floor(d % 3600 / 60);
      var s: number = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return hDisplay + mDisplay + sDisplay; 
  }

  let successfullyFinalized: number = 0;
  if (progress.platform) {
    successfullyFinalized = progress.finalized_collect_tasks_count * 100 / progress.tasks_count;
    successfullyFinalized = Math.floor(successfullyFinalized * 100)/100
  }
  let totalFinalized: number = 0;
  if (progress.platform) {
    totalFinalized = (progress.finalized_collect_tasks_count + progress.failed_collect_tasks_count) * 100 / progress.tasks_count;
    totalFinalized = Math.floor(totalFinalized * 100)/100
  }
  
  // console.log(`NUmber -> for index ${i}`, progressValue);
  return (
    <Row key={progress.platform} className="mt-50">
      <Col span={4}>
        { progress.platform ? platformIcon(progress.platform) : ''} stats 
      </Col>

      <Col span={20}>
        { typeof(totalFinalized) === "number" && totalFinalized < 100 ? "Details are being loaded…" : "Details fetched" } 
        
        <Progress percent={ totalFinalized } strokeColor="red" success={{ percent:  successfullyFinalized }} showInfo={true} />
        {
          `Posts count: ${progress.posts_count}`
        }
        
        {' - '}
        {
          progress?.time_estimate ? `Estimated time to get data: ${secondsToHms(progress.time_estimate)}` : ''
        }
      </Col>
    </Row>
  )

  return (
    <>
      {/* <Progress percent={percentage} success={{ percent: success || 50 }} showInfo={showInfo} /> */}
      <Progress percent={ 50 } success={{ percent: 20 }} />
      {/* <Progress percent={ 50 } strokeColor="red" success={{ percent: success || 20 }} showInfo={showInfo} /> */}
    </>
  )
}

export default ProgressBar