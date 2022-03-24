import { el } from 'date-fns/locale';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { getElem } from '../form/Form';
import { TaxonomyContext } from './Context';

import './Taxonomy.css';

export function TaxonomyForm({ formData }: any) {
  const { form, update } = useContext(TaxonomyContext);
  const { title, data, redirect } = formData;

  return (
    <div className="tax-full">
      <div className="tax-title-line">
        <div className="tax-mid">{title}</div>
      </div>
      <div className="tax-mid">
        <br />
        {data.map((el: any) => (
          <div key={el.id}>
            <br /><br />
            {el.title}
            <br /><br />
            {getElem(el, update(el))}
          </div>
        ))}
        <Link to={redirect}>
          <button>Next</button>
        </Link>
      </div>
    </div>
  );
}