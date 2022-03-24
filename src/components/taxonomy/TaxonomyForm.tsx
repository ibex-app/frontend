import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { getElem } from '../form/inputs/Form';
import { TaxonomyContext } from './Context';

import './Taxonomy.css';

export function TaxonomyForm({ formData }: any) {
  const { form, update } = useContext(TaxonomyContext);
  const { title, data } = formData;

  console.log(formData);

  return (
    <div className="tax-full">
      <div className="tax-title-line">
        <div className="tax-mid">{title}</div>
      </div>
      <div className="tax-mid">
        <br />
        {data.map((el: any) => (
          <>
            <br /><br />
            {el.title}
            <br /><br />
            {getElem(el, () => { })}
          </>
        ))}
        <Link to="/taxonomy/params" className="">
          <button >Next</button>
        </Link>
        {/* <button >Run</button> */}
      </div>
    </div>
  );
}