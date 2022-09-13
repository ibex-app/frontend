import React from 'react'
import { Progress } from 'antd';

type ProgressBarProps = {
  percentage: number,
  showInfo?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({percentage, showInfo}: ProgressBarProps) => {
  return (
    <>
      <Progress percent={percentage} showInfo={showInfo} />
    </>
  )
}

export default ProgressBar