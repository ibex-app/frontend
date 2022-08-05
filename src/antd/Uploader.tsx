import { getElem } from './utils/ElementGetter';
import { useState } from 'react';
import { FormElement } from '../types/form';

export function Uploader({ element }: { element: FormElement }) {
    const { children, label, checkboxTitle, isOpen } = element;
    const [show, setShow] = useState(isOpen);

    return (
        <div>
            <div className="tax-large-title">{label}</div>
            <div></div>
            {/* <label className="container flex align-middle"> */}
                {/* <span className="tax-label">{checkboxTitle}</span> */}
                {/* <input type="checkbox" onChange={(event) => setShow(event.target.checked)}></input> */}
                {/* <span className={`checkmark ${show ? 'checked' : ''}`}></span> */}
            {/* </label> */}
            {/* <div className={`tax-toggle-cont ${show ? 'tax-toggle-cont-show' : ''}`} > */}
            <div className='tax-toggle-cont tax-toggle-cont-show' >
                {
                    children && <div key={children[0].id}>
                                    {getElem(children[0])}
                                </div>
                }
                <div className="tax-line-cont"> 
                    <div className="tax-line"></div> <div className="tax-line-or">OR</div>
                </div>
                {
                    children && <div key={children[1].id}>
                                    {getElem(children[1])}
                                </div>
                }

            </div>
        </div>
    );
}