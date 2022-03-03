import { Tag } from '../inputs/Tag';
import { FilterElement } from '../../types/form';
import { useEffect, useMemo, useState } from 'react';

import './Taxonomy.css';

export function TaxonomyInit() {
    const [keywordTag, setKeywordTag] = useState('upload')
    const [accountTag, setAccountTag] = useState('upload')
    
    
    return (
      <div className="tax-full">
          <div className="tax-title-line">
            <div className="tax-mid">Create report</div>
          </div>
          <div className="tax-mid">
          <br/><br/><br/>
            What is the name of the report? <br/><br/>
            <input type="text" placeholder=""></input><br/><br/>
            What is the report about? <br/><br/>
            <textarea className="" ></textarea><br/><br/>
            {/* How do you like to collect your data? <br/>
            <input type="radio" /> List of keywords<br/>
            <input type="radio" /> Taxonomy tool<br/> */}
            {/* <input type="date" /> */}
          <a href="/taxonomy-params" className=""><button >Next</button></a>
          {/* <button >Run</button> */}
            </div>
      </div>
    );
  }