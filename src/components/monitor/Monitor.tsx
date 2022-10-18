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
    return <div className="monitor-block">
        <span>{monitorData?.monitor?.title }</span> 
        <span> { monitorData?.monitor?.platforms?.map(a => platformIcon(a)) } </span>
        <br></br>
        <span>{monitorData?.monitor?.descr }</span>
        <br></br>
        <div> { monitorData?.accounts.map((account: Account) => <span>{account.platform ? platformIcon(account.platform) : ''} {account.title}</span>)}</div>
        <div> { monitorData?.search_terms.map((search_term: SearchTerm) => <div>{drawFilterItem({ title: search_term?.term })}</div>)}</div>
        
        <span> { monitorData?.monitor?.date_from && monitorData?.monitor?.date_from.toString().slice(0, 10) }</span>
        <span> { monitorData?.monitor?.date_to ? monitorData?.monitor?.date_from.toString().slice(0, 10) : 'Live'}</span>
    </div>
}