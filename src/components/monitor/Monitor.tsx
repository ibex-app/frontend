import { List } from "antd";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MonitorRespose, SearchTerm } from '../../types/taxonomy';
import { Account } from '../../types/hitscount';

import { drawFilterItem } from "../../shared/Utils/Taxonomy";

import { Col, Row, Layout, Space } from 'antd';
import { platformIcon } from '../../shared/Utils';

type MonitorBlockInput = {
    monitorData: MonitorRespose
}

export const MonitorBlock = ({ monitorData } : MonitorBlockInput ) => {
    
    return <Row className="post bottom-50">
    <Col span={16}>
       {
        monitorData ? 
        <Space direction="vertical">
          <div>
            <h1>{monitorData?.monitor?.title}</h1>
            { 
            <>
              <h3> 
                  From: { monitorData?.monitor?.date_from && new Date( monitorData?.monitor?.date_from).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }) }
                  { 
                      monitorData?.monitor?.date_to 
                          ? 'to:' + new Date( monitorData?.monitor?.date_to).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }) 
                          : <span className="live">Live</span>
                  }
              </h3>
            </>
          }
          </div>
          <div>{monitorData?.monitor?.descr }</div>
          <Row> { monitorData?.monitor?.platforms?.map(a => <Col span={4}>{platformIcon(a)}</Col> ) } </Row>
          <div> { monitorData?.accounts.map((account: Account) => <span>{account.platform ? platformIcon(account.platform) : ''} {account.title}</span>)}</div>
          <div> { monitorData?.search_terms.map((search_term: SearchTerm) => <div>{drawFilterItem({ title: search_term?.term })}</div>)}</div>
        </Space>
        : ''
      }
    </Col>
    
  </Row>
}

// <div className="monitor-block post">

//         <span> { monitorData?.monitor?.platforms?.map(a => platformIcon(a)) } </span>
//         <br></br>
//         <span></span>
//         <br></br>

        
//         <span> { monitorData?.monitor?.date_from && monitorData?.monitor?.date_from.toString().slice(0, 10) }</span>
//         <span> { monitorData?.monitor?.date_to ? monitorData?.monitor?.date_from.toString().slice(0, 10) : 'Live'}</span>
//     </div>