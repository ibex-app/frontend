import { pipe } from 'fp-ts/lib/function';
import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getElem } from '../form/Form';
import { TaxonomyContext } from './Context';

import './Taxonomy.css';

export function TaxonomyForm({ formData }: any) {
  const { form, update } = useContext(TaxonomyContext);
  const { title, data, redirect } = formData;

  useEffect(() => console.log(form), [form]);

  return (
    <div className="tax-full">
      <div className="tax-title-line">
        <div className="tax-mid">{title}</div>
      </div>
      <div className="tax-mid">

        {data.map((el: any) => (
          <div key={el.id}>
            <div className="tax-label">{el.title} {el.required ? <span>*</span> : ''}</div>
            {getElem(el, update)}
            <div className="tax-line"></div>
          </div>
        ))}
        <Link to={redirect}>
          <button>Next</button>
        </Link>
      </div>
    </div>
  );
}