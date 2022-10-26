import { MonitorRespose, SearchTerm } from '../../types/taxonomy';
import { Account } from '../../types/hitscount';

import { PieChartOutlined, CopyOutlined, DeleteOutlined, UnorderedListOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { drawFilterItem } from "../../shared/Utils/Taxonomy";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Row, Space } from 'antd';
import { platformIcon } from '../../shared/Utils';
import { Collapse } from 'antd';
import React from 'react';

const { Panel } = Collapse;

type MonitorBlockInput = {
  monitorData: MonitorRespose,
  extraButtons?: {
    showDuplicateModal: any,
    showDeleteModal: any
  },
  hideButtons?: boolean
}

export const MonitorBlock = ({ monitorData, extraButtons, hideButtons }: MonitorBlockInput) => {
  const navigate = useNavigate();

  return <Row className="post bottom-50">
    <Col span={24}>
       {
        monitorData ? 
        <Space direction="vertical">
          <div>
          <Row>  <Col > <h1>{monitorData?.title} </h1></Col> { monitorData?.platforms?.map(a => <Col className="small-social">{platformIcon(a)}</Col> ) }</Row>
            { 
            <>
              <h3> 
                  From: { monitorData?.date_from && new Date( monitorData?.date_from).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }) }
                  { 
                      monitorData?.date_to 
                          ? 'to:' + new Date( monitorData?.date_to).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' }) 
                          : <span className="live">Live</span>
                  }
              </h3>
            </>
          }
          </div>
          
          <div>{monitorData?.descr }</div>
          {
            hideButtons ? <></>
            :
             <>
             <Row>
              {
                monitorData.status > 2 
                ? <>
                <Col span={12}><Button className='post-btn' onClick={() => navigate("/results/?monitor_id=" + monitorData._id)}> <UnorderedListOutlined key="posts" /> Posts </Button> </Col>
                <Col span={12}><Button className='post-btn'  onClick={() => navigate("/results/summary?monitor_id=" + monitorData._id)}><CloudDownloadOutlined key="summary" /> Download</Button></Col>
                </>
                :
                <Col span={12}><Button className='post-btn' onClick={() => navigate("/taxonomy/results/?monitor_id=" + monitorData._id)}> <UnorderedListOutlined key="samples" /> Samples </Button> </Col>

              }
          </Row>
          <div className='extra-buttons'>
                {extraButtons ? 
                  <><Button  onClick={() => extraButtons.showDuplicateModal(monitorData)}><CopyOutlined key="duplicate" /> Duplicate</Button>,
                 <Button  className='delete-mon' onClick={() => extraButtons.showDeleteModal(monitorData)}><DeleteOutlined key="delete" /> Delete</Button> 
                 </>
                : ''
              }
            </div>
             </>

          }
          
            {
              monitorData?.accounts?.length || monitorData?.search_terms?.length 
              ?
              <Collapse  ghost>

              <Panel header={monitorData?.accounts?.length ? 'Accounts' : 'Search Terms'} key="1">
          
                <div className='in-monitor-list'> { (monitorData?.accounts || []).map((account: Account) => <div>{account.platform ? platformIcon(account.platform) : ''} {account.title}</div>)}</div>
                <div className='in-monitor-list'> { (monitorData?.search_terms || []).map((search_term: SearchTerm) => <div>{drawFilterItem({ title: search_term?.term })}</div>)}</div>
              </Panel>
              </Collapse>
              : <></>
            }
          
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