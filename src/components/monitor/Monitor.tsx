import { MonitorRespose, SearchTerm } from '../../types/taxonomy';
import { Account } from '../../types/hitscount';

import { drawFilterItem } from "../../shared/Utils/Taxonomy";

import { Col, Row, Space } from 'antd';
import { platformIcon } from '../../shared/Utils';

type MonitorBlockInput = {
  monitorData: MonitorRespose
}

export const MonitorBlock = ({ monitorData }: MonitorBlockInput) => {

  return <Row className="post bottom-50">
    <Col span={16}>
      {
        monitorData ?
          <Space direction="vertical">
            <div>
              <h1>{monitorData?.title}</h1>
              {
                <>
                  <h3>
                    From: {monitorData?.date_from && new Date(monitorData?.date_from).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {
                      monitorData?.date_to
                        ? 'to:' + new Date(monitorData?.date_to).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' })
                        : <span className="live">Live</span>
                    }
                  </h3>
                </>
              }
            </div>
            <div>{monitorData?.descr}</div>
            <Row> {monitorData?.platforms?.map(a => <Col span={4}>{platformIcon(a)}</Col>)} </Row>
            <div> {monitorData?.accounts.map((account: Account) => <span>{account.platform ? platformIcon(account.platform) : ''} {account.title}</span>)}</div>
            <div> {monitorData?.search_terms.map((search_term: SearchTerm) => <div>{drawFilterItem({ title: search_term?.term })}</div>)}</div>
          </Space>
          : ''
      }
    </Col>

  </Row>
}

// <div className="monitor-block post">

//         <span> { monitorData?.platforms?.map(a => platformIcon(a)) } </span>
//         <br></br>
//         <span></span>
//         <br></br>


//         <span> { monitorData?.date_from && monitorData?.date_from.toString().slice(0, 10) }</span>
//         <span> { monitorData?.date_to ? monitorData?.date_from.toString().slice(0, 10) : 'Live'}</span>
//     </div>