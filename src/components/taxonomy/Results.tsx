import * as E from "fp-ts/lib/Either";
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FormElement } from '../../types/form';
import { useContext, useEffect, useMemo, useState } from 'react';
import moment from "moment";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube, faTelegram } from "@fortawesome/free-brands-svg-icons"
import { faSliders, faAngleUp, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { isObjectEmpty, tagItemsToArray } from '../../shared/Utils';
import { useGlobalState } from '../../app/store';
import { Get, Response } from '../../shared/Http';
import { getFilters } from '../../shared/Utils';
import { map, pipe, reduce, split, trim } from "ramda";
import { Button, Col, Collapse, Input, Row, Space, Table } from "antd";

const { Panel } = Collapse;

type HitsCountTable = {
  columns: Array<any>,
  data: Array<any>
}

type HitsCountItem = {
  keyword: string,
  facebook: number,
  twitter: number,
  youtube: number,
  vkontakte: number,
  telegram: number
};

type HitsCountResponse = Array<HitsCountItem>;

const formatNum = (num: number): string => {
  if (num < 10000) return num.toLocaleString()
  return Math.floor(num / 1000).toLocaleString() + 'K'
}

const hitCountCols = [
  {
    title: "Keyword",
    dataIndex: "keyword",
    key: "keyword",
  },
  {
    title: "Facebook",
    dataIndex: "facebook",
    key: "facebook",
    render: () => <FontAwesomeIcon icon={faFacebook} />,
  },
  {
    title: "YouTube",
    dataIndex: "youtube",
    key: "youtube",
    render: () => <FontAwesomeIcon icon={faYoutube} />,
  },
  {
    title: "Twitter",
    dataIndex: "twitter",
    key: "twitter",
    render: () => <FontAwesomeIcon icon={faTwitter} />,
  }
];

const generateHitsCountTableData = E.fold(
  () => [],
  map(({ keyword, facebook, youtube, twitter }: HitsCountItem) => ({
    keyword,
    facebook: formatNum(facebook) || 0,
    youtube: formatNum(youtube) || 0,
    twitter: formatNum(twitter) || 0,
  }))
);

const operators = ["AND", "OR", "NOT"];
const filterListRaw = ["Violence AND Women", "Georgia", "Russia AND Belarus"];

const filterHasOperator = (s: string) => reduce((acc, op) => {
  const hasOp = s.includes(op);
  return hasOp ? { hasOp, op, s } : acc;
}, { s } as { hasOp: boolean, op: string, s: string }, operators);

const createFilterElem = ({ hasOp, s, op }: { hasOp: boolean, s: string, op: string }) => {
  if (!hasOp) return { hasOp, left: s };
  const [left, right] = s.split(op);
  return { hasOp, left: trim(left), right: trim(right), op };
}

const drawFilterItem = pipe(
  filterHasOperator,
  createFilterElem,
  ({ hasOp, left, right, op }: { hasOp: boolean, left: string, right?: string, op?: string }) =>
    hasOp ? <Space>
      <span className="keyword">{left}</span>
      <span className="op">{op}</span>
      <span className="keyword">{right},</span>
    </Space> : <span className="keyword">{left},</span>

)

export const TaxonomyResults = ({ form }: any) => {
  const { search } = useLocation();
  const [hitsCount, setHitsCount] = useState<HitsCountTable>({ columns: [], data: [] });
  const [posts, setPosts] = useState<Response<any>>(E.left(Error('Not fetched')));

  const monitor_id = useMemo(() => new URLSearchParams(search).get('monitor_id'), [search]);

  useEffect(() => {
    Get<HitsCountResponse>('get_hits_count', { id: monitor_id }).then((data) => {
      setHitsCount({
        columns: hitCountCols,
        data: generateHitsCountTableData(data)
      })
    });

    Get<any>('posts', { monitor_id }).then(setPosts);
  }, [monitor_id]);

  // const [monitor, setMonitor]: any = useState();
  // const [existing, setExisting]: any = useState(false);
  // const [timeLeft, setTimeLeft]: any = useState(null);
  // const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();
  // const [filters, setFilters]: any = useGlobalState('filters');
  // const { data }: { data: FormElement[] } = require('../../data/filter.json')


  // const finalize_form = (form: any) => {
  //     form.accounts = form.accounts || []
  //     form.search_terms = form.search_terms || []
  //     form.search_terms = form.search_terms.map((search_term: any) => search_term.customOption ? search_term.label : search_term)

  //     form.accounts = form.accounts.map((account: any) => ({
  //         platform: account.platform,
  //         platform_id: account.platform_id,
  //         title: account.title
  //     }))

  //     const data = {
  //         ...form,
  //         accounts: form.accounts.map((account: any) => ({
  //             platform: account.platform,
  //             platform_id: account.platform_id,
  //             title: account.title
  //         })),
  //     }

  //     delete data['date'];
  //     // delete data['languages'];
  //     return data;
  // }

  // const estimateTime = (form: any) => {
  //     const timeLeft = (form.search_terms.length || 1) * 8 * form.platforms.length
  //     console.log('estimateTime', timeLeft)
  //     setTimeLeft(timeLeft)
  //     return timeLeft
  // }

  // useEffect(() => {
  //     if (timeLeft === 0) {
  //         console.log("TIME LEFT IS 0");
  //         setTimeLeft(null)
  //     }

  //     // exit early when we reach 0
  //     if (!timeLeft) return;

  //     // save intervalId to clear the interval when the
  //     // component re-renders
  //     const intervalId = setInterval(() => {

  //         setTimeLeft(timeLeft - 1);
  //     }, 1000);

  //     // clear interval on re-render to avoid memory leaks
  //     return () => clearInterval(intervalId);
  //     // add timeLeft as a dependency to re-rerun the effect
  //     // when we update it
  // }, [timeLeft]);

  // useEffect(() => {
  //     setFilters({})
  //     let urlFilters: any = getFilters(data)
  //     if (urlFilters.monitor_id) {
  //         setExisting(true)
  //         const fetchData = Get('get_monitor', { id: urlFilters.monitor_id });
  //         fetchData.then((_data: Response<any>) => {
  //             let maybeData: any = E.getOrElse(() => [])(_data)
  //             if (!maybeData) return
  //             setMonitor(maybeData.monitor)
  //             // update({ "id": "title" })(maybeData.monitor.title)
  //         });
  //     } else {
  //         if (!form || monitor) return
  //         if (isObjectEmpty(form)) navigate('../init');
  //         const finalForm: any = finalize_form(form)
  //         estimateTime(finalForm)
  //         const createMonitor = Get('create_monitor', finalForm);

  //         createMonitor.then((_data: Response<any>) => {
  //             let _monitor: any = E.getOrElse(() => [])(_data);
  //             setSearchParams({ 'monitor_id': _monitor._id })
  //             setMonitor(_monitor)
  //         });
  //     }
  // }, [])

  // const timeOut = (time: number) => new Promise((resolve, reject) => {
  //     setTimeout(() => resolve(true), time)
  // })

  // useEffect(() => {
  //     console.log(timeLeft)
  // }, [timeLeft])

  // useEffect(() => {
  //     if (!monitor) return;
  //     const collectSample = !existing ? Get('collect_sample', { id: monitor._id }) : new Promise((resolve, reject) => resolve(true))

  //     const _timeLeft: number = !existing ? timeLeft : 0

  //     setTimeLeft(_timeLeft)

  //     collectSample
  //         .then(() => timeOut(_timeLeft))
  //         .then(() => {
  //             setFilters({
  //                 time_interval_to: monitor.date_to || moment().subtract(3, 'hour').format("YYYY-MM-DD"),
  //                 time_interval_from: monitor.date_from,
  //                 monitor_id: monitor._id
  //             });
  //             const getHitsCount = Get('get_hits_count', { id: monitor._id })
  //             return getHitsCount
  //         }).then((hitsCountResponce: Response<any>) => {
  //             let _hitsCountResponce = E.getOrElse(() => [])(hitsCountResponce);
  //             setHitsCount(_hitsCountResponce)
  //         })
  // }, [monitor])

  return (
    <Row>
      <Col span={8}>
        <Space direction="vertical" style={{ display: "flex" }}>
          <div className="leftbox-title"> <span>TODO Change</span> <FontAwesomeIcon icon={faSliders} /></div>
          <div className="leftbox-inner">
            <Space size="small">
              <Input placeholder="Search in your list" prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />} />
              <Button>Add</Button>
            </Space>
            {/* <Table columns={hitsCount.columns} dataSource={hitsCount.data} /> */}
            <Table />
          </div>
          <Collapse style={{ margin: "0 5%" }}>
            <Panel header="Recommended keywords" key={1}>
              <Table />
            </Panel>
          </Collapse>
        </Space>
      </Col>
      <Col span={16}>
        <Space className="flex search-header">
          Search results for {map(drawFilterItem, filterListRaw)}
        </Space>
        <Table />
      </Col>
    </Row>
  )
  // return (
  //     <div className='results-full'>
  //         <div className="leftbox">
  //             <div className="leftbox-title"> <span>{form.title}</span> <FontAwesomeIcon icon={faSliders} /></div>
  //             <div className="leftbox-title leftbox-title-blue"> Taxonomy editor </div>
  //             <div className="leftbox-inner">

  //             </div>

  //             <div className="leftbox-inner leftbox-inner-recomm">
  //                 <div className="leftbox-title leftbox-title-blue"> Recommended keywords <FontAwesomeIcon icon={faAngleUp} /></div>
  //             </div>
  //             {/* <button className='left-m-5'>Get Semple</button> */}
  //             {/* <button >Run</button> */}

  //         </div>
  //         {/* <div className='tax-right-block'>
  //             <div className='hits-count'>
  //                 {
  //                     E.fold(
  //                         () => <div>No data</div>,
  //                         ({ facebook, twitter, youtube, telegram, vkontakte }: HitsCountResponse) => (<div>
  //                             Counts for Monitor:
  //                             {<span><FontAwesomeIcon icon={faFacebook} /> {facebook || 0}</span>}
  //                             {<span><FontAwesomeIcon icon={faTwitter} /> {twitter || 0}</span>}
  //                             {<span><FontAwesomeIcon icon={faYoutube} /> {youtube || 0}</span>}
  //                             {<span><FontAwesomeIcon icon={faTelegram} /> {telegram || 0}</span>}
  //                             {<span><img src='https://upload.wikimedia.org/wikipedia/commons/2/21/VK.com-logo.svg' /> {vkontakte || 0}</span>}
  //                         </div>)
  //                     )(hitsCount)
  //                 }
  //             </div>
  //             {timeLeft > 0 ? <div className='hits-count'> Please wait {timeLeft} seconds...</div> : <Table />}
  //         </div> */}
  //         {/* <Table mapFilter={false} /> */}

  //     </div>
  // );
}

