import { getElem } from '../form/Form';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaxonomyContext } from './Context';
import { Checkbox } from "../form/inputs/Checkbox";

export function SearchTerms({ formData }: any, onChange: any) {
    const { form, update } = useContext(TaxonomyContext);
    const { title, data, redirect } = formData;
    const [show, setShow] = useState(true );

    const load_uploaded = (e : any) => {
        if(e.length && e[0] && e[0]['search term']) {
            update(data[0])(e.map((a: any) => a['search term']));   
        } else {
            update(data[0])(e);   
        }
    }

    return (
        <div>
            <div className="tax-large-title">Keywords</div>
            <div></div>
            <label className="container"> 
                <span className="tax-label"> Do you have specific keywords you would like to collect posts with?</span>
                <input type="checkbox" onChange={(event) => setShow(event.target.checked)} checked={show}></input>
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