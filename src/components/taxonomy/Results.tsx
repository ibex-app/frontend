import * as E from "fp-ts/lib/Either";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tag } from '../form/inputs/Tag';
import { FilterElement } from '../../types/form';
import { useContext, useEffect, useState } from 'react';
import { Table } from '../table/Table';
import { TaxonomyContext } from './Context';
import moment from "moment";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube, faTelegram } from "@fortawesome/free-brands-svg-icons"
import { faSliders, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import { isObjectEmpty, tagItemsToArray } from '../../shared/Utils';
import { useGlobalState } from '../../app/store';
import { Get, Response } from '../../shared/Http';
import { getFilters } from '../../shared/Utils';

export function TaxonomyResults() {
    // const [keywordTag, setKeywordTag] = useState('input')
    // const [accountTag, setAccountTag] = useState('input')
    const { form, update } = useContext(TaxonomyContext);
    const [ hitsCount, setHitsCount ]: any = useState();
    const [ monitor, setMonitor ]: any = useState();
    const [ existing, setExisting ]: any = useState(false);
    const [ timeLeft, setTimeLeft ]: any = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filters, setFilters]: any = useGlobalState('filters');
    const { data }: { data: FilterElement[] } = require('../../data/filter.json')


    const finalize_form = (form: any) => {
        form.accounts = form.accounts || []
        form.search_terms = form.search_terms || []
        form.search_terms = form.search_terms.map((search_term:any) => search_term.customOption ? search_term.label : search_term)
        
        form.accounts = form.accounts.map((account:any) => ({
            platform: account.platform,
            platform_id: account.platform_id,
            title: account.title
        }))

        const data = {
            ...form,
            accounts: form.accounts.map((account:any) => ({
                platform: account.platform,
                platform_id: account.platform_id,
                title: account.title
            })),
        }

        delete data['date'];
        // delete data['languages'];
        return data;
    }

    const estimateTime = (form: any) => {
        const timeLeft = (form.search_terms.length || 1 )* 8 * form.platforms.length
        console.log('estimateTime', timeLeft)
        setTimeLeft(timeLeft)
        return timeLeft
    }
    
    useEffect(() => {
        if(timeLeft===0){
           console.log("TIME LEFT IS 0");
           setTimeLeft(null)
        }
    
        // exit early when we reach 0
        if (!timeLeft) return;
    
        // save intervalId to clear the interval when the
        // component re-renders
        const intervalId = setInterval(() => {
    
          setTimeLeft(timeLeft - 1);
        }, 1000);
    
        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
        // add timeLeft as a dependency to re-rerun the effect
        // when we update it
      }, [timeLeft]);

    useEffect(() => {
        setFilters({})
        let urlFilters:any = getFilters(data)
        if(urlFilters.monitor_id){
            setExisting(true)
            const fetchData = Get('get_monitor', { id: urlFilters.monitor_id });
            fetchData.then((_data: Response<any>) => {
                let maybeData: any = E.getOrElse(() => [])(_data)
                if (!maybeData) return
                setMonitor(maybeData.monitor)
                update({"id": "title"})(maybeData.monitor.title)
            });
        } else {
            if (!form || monitor) return
            if (isObjectEmpty(form)) navigate('../init');
            const finalForm:any = finalize_form(form)
            estimateTime(finalForm)
            const createMonitor = Get('create_monitor', finalForm);

            createMonitor.then((_data: Response<any>) => {
                let _monitor: any = E.getOrElse(() => [])(_data);
                setSearchParams({'monitor_id': _monitor._id}) 
                setMonitor(_monitor)
            }); 
        }
    }, [])

    const timeOut = (time: number) => new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), time)
    })
    
    useEffect(() => {
        console.log(timeLeft)
    }, [timeLeft])
    
    useEffect(() => {
        if(!monitor) return;
        const collectSample = !existing ? Get('collect_sample', { id: monitor._id }) : new Promise((resolve, reject) => resolve(true))
        
        const _timeLeft: number = !existing ? timeLeft : 0
        
        setTimeLeft(_timeLeft)

        collectSample
            .then(() => timeOut(_timeLeft))
            .then(() => {
                setFilters({
                    time_interval_to: monitor.date_to || moment().subtract(3, 'hour').format("YYYY-MM-DD"),
                    time_interval_from: monitor.date_from,
                    monitor_id: monitor._id
                });
                const getHitsCount = Get('get_hits_count', { id: monitor._id })
                return getHitsCount
            }).then((hitsCountResponce: Response<any>) => {
                let _hitsCountResponce = E.getOrElse(() => [])(hitsCountResponce);
                setHitsCount(_hitsCountResponce)
            })
    }, [monitor])

    const formatNum = (num: number): string => {
        if(num < 10000) return num.toLocaleString()
        return Math.floor(num/1000).toLocaleString() + 'K'
    }

    return (
        <div className='results-full'>
            <div className="leftbox">
                <div className="leftbox-title"> <span>{form.title}</span> <FontAwesomeIcon icon={faSliders} /></div>
                <div className="leftbox-title leftbox-title-blue"> Taxonomy editor </div>
                <div className="leftbox-inner">
                    <input type="text" className="tax-search"></input>
                    {/* <button className="round-btn-transp round-btn-transparent">Add</button> */}
                    <table className='tax-keywords-table'>
                        <thead>
                            <tr>
                                <td></td>
                                <td>Keyword</td>
                                <td><FontAwesomeIcon icon={faFacebook} /></td>
                                <td><FontAwesomeIcon icon={faYoutube} /></td>
                                <td><FontAwesomeIcon icon={faTwitter} /></td>
                                {/* <td><FontAwesomeIcon icon={faTelegram} /></td> */}
                            </tr>
                        </thead>
                        <tbody>
                                {
                                    hitsCount 
                                        ? 
                                            
                                            Object.keys(hitsCount).map((hitsCountTerm: any) => {
                                                return <tr>
                                                    <td><input type="checkbox" ></input></td>
                                                    <td>{hitsCountTerm}</td>
                                                    { hitsCount[hitsCountTerm].facebook ? <td> {formatNum(hitsCount[hitsCountTerm].facebook) || 0}</td> : <td></td> }
                                                    { hitsCount[hitsCountTerm].twitter ? <td> {formatNum(hitsCount[hitsCountTerm].twitter) || 0}</td> : <td></td> } 
                                                    { hitsCount[hitsCountTerm].youtube ? <td> {formatNum(hitsCount[hitsCountTerm].youtube) || 0}</td> : <td></td> } 
                                                    {/* { hitsCount[hitsCountTerm].telegram ? <td> {hitsCount[hitsCountTerm].telegram.toLocaleString() || 0}</td> : <td></td> }      */}
                                                </tr>
                                            
                                        }) 
                                    
                                        : <td></td>
                                } 
                        </tbody>
                    </table>
                    
                    
                </div>

                <div className="leftbox-inner leftbox-inner-recomm">
                    <div className="leftbox-title leftbox-title-blue"> Recommended keywords <FontAwesomeIcon icon={faAngleUp} /></div>
                </div>
                {/* <button className='left-m-5'>Get Semple</button> */}
                {/* <button >Run</button> */}

            </div> 
            <div className='tax-right-block'>
                {/* <div className='hits-count'>
                    {
                        hitsCount ? <div>
                            Counts for Monitor: 
                                { hitsCount.facebook ? <span><FontAwesomeIcon icon={faFacebook} /> {hitsCount.facebook || 0}</span> : '' }
                                { hitsCount.twitter ? <span><FontAwesomeIcon icon={faTwitter} /> {hitsCount.twitter || 0}</span> : '' } 
                                { hitsCount.youtube ? <span><FontAwesomeIcon icon={faYoutube} /> {hitsCount.youtube || 0}</span> : '' } 
                                { hitsCount.telegram ? <span><FontAwesomeIcon icon={faTelegram} /> {hitsCount.telegram || 0}</span> : '' } 
                                { hitsCount.vkontakte ? <span><img src='https://upload.wikimedia.org/wikipedia/commons/2/21/VK.com-logo.svg' /> {hitsCount.vkontakte || 0}</span> : '' } 
                            </div> : ''
                    }
                </div> */}
                { timeLeft > 0 ? <div className='hits-count'> Please wait {timeLeft} seconds...</div> : <Table/> }
            </div>
            {/* <Table mapFilter={false} /> */}
            
        </div>
    );
}