import { getElem } from '../form/Form';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaxonomyContext } from './Context';
import { Checkbox } from "../form/inputs/Checkbox";

export function Accounts({ formData }: any) {
    const { form, update } = useContext(TaxonomyContext);
    const { title, data, redirect } = formData;
    const [show, setShow] = useState(false);

    const load_uploaded = (e : any) => {
        if(e.length && e[0] && e[0]['platform_id']) {
            update(data[0])(e.map((account: any, index: number) => ({ 
                id: index, 
                label: account.title + ' - ' + account.platform, 
                _id: account.platform_id,

                platform: account.platform, 
                platform_id: account.platform_id,
                title: account.title
            })));   
        } else {
            update(data[0])(e);   
        }
    }

    return (
        <div>
            <div className="tax-large-title">Accounts</div>
            <div></div>
            <label className="container"> 
                <span className="tax-label"> Do you have specific accounts you would like to collect posts with?</span>
                <input type="checkbox" onChange={(event) => setShow(event.target.checked)}></input>
                <span className={`checkmark ${show ? 'checked' : '' }`}></span>
            </label>
            <div className={`tax-toggle-cont ${show ? 'tax-toggle-cont-show' : '' }`} >
                { 
                    data.map((el: any) => (
                        <div key={el.id}>
                            <div className="tax-label">{el.title} {el.required ? <span>*</span> : ''}</div>
                            {getElem(el, load_uploaded)}
                            <div className="tax-line"></div>
                        </div>
                        ))
                }
            </div>
        </div>
    );
}