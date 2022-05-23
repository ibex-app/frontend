import { getElem } from './utils/ElementGetter';
import { useState } from 'react';
import { FormElement } from '../types/form';

export function Uploader({ element }: { element: FormElement }) {
    const [show, setShow] = useState(false);
    const { children, label, checkboxTitle } = element;

    return (
        <div>
            <div className="tax-large-title">{label}</div>
            <div></div>
            <label className="container flex align-middle">
                <span className="tax-label">{checkboxTitle}</span>
                <input type="checkbox" onChange={(event) => setShow(event.target.checked)}></input>
                <span className={`checkmark ${show ? 'checked' : ''}`}></span>
            </label>
            <div className={`tax-toggle-cont ${show ? 'tax-toggle-cont-show' : ''}`} >
                {
                    children && children.map((el: any) => (
                        <div key={el.id}>
                            {getElem(el)}
                            <div className="tax-line"></div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}