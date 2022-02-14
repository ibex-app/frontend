import { Tag } from '../inputs/Tag';
import { FilterElement } from '../../types/form';
import { useEffect, useMemo, useState } from 'react';

import './Taxonomy.css';

export function Taxonomy() {
    const [keywordTag, setKeywordTag] = useState('upload')
    const [accountTag, setAccountTag] = useState('upload')
    
    

    const el: FilterElement = {
      // "id": "dataSource",
      "id": 33,
      "type": "tag",
      "label": "Data source",
      "value": [],
      "values": []
    }
    // el.values.push({
    //   "id": 1,
    //   "label": "RadioPirveli"
    // })

    return (
      <div className="leftbox">
        <div>
          <input type="text" placeholder="Name"></input>
          <textarea className="" placeholder="Description"></textarea>
          <input type="date" />

          <h3>Search terms</h3>
          <div className="tabs">
            <div className="tab" onClick={() => setKeywordTag('upload')}>Upload</div>
            <div className="tab" onClick={() => setKeywordTag('input')}>Input manulay</div>
            <div className="tab" onClick={() => setKeywordTag('tags')}>Use existing</div>
          </div>
          { keywordTag == 'upload' ? <div> <input type="file" /> </div> : null }
          { keywordTag == 'tags' ? <div><Tag data={el}></Tag></div> : null }
          { keywordTag == 'input' ? <div>
            <input type="text" placeholder=""/> <button>add</button>
            <table>
              <thead><tr><td>Keyword</td><td>Results</td><td>Match</td></tr></thead>
              <tbody>
                <tr><td>Violance</td><td></td><td>Del</td></tr>
                <tr><td>Gaza OR Yemen</td><td></td><td>Del</td></tr>
                <tr><td>Gaza NOT Nablus</td><td></td><td>Del</td></tr>
                <tr><td>Violance</td><td></td><td>Del</td></tr>
                </tbody>
            </table>
           </div> : null }
           <div className="sugg" >Suggestions: <a href="#">Israel</a>, <a href="#">Hamas</a></div>

          <h3>Accounts</h3>
          <div className="tabs">

          <div className="tab" onClick={() => setAccountTag('upload')}>Upload</div>
          <div className="tab" onClick={() => setAccountTag('input')}>Input manulay</div>
          <div className="tab" onClick={() => setAccountTag('tags')}>Use existing</div>
          </div>
          { accountTag == 'upload' ? <div> <input type="file" /> </div> : null }
          { accountTag == 'tags' ? <div><Tag data={el}></Tag></div> : null }
          { accountTag == 'input' ? <div>
            <input type="text" placeholder=""/> <button>add</button>
            <table>
              <thead><tr><td>Keyword</td><td>Platform</td><td>Match</td></tr></thead>
              <tbody>
                <tr><td>BBC</td><td>fb</td><td>Del</td></tr>
                <tr><td>BBC</td><td>tw</td><td>Del</td></tr>
                <tr><td>BBC</td><td>yt</td><td>Del</td></tr>
                <tr><td>CNN</td><td>fb</td><td>Del</td></tr>
                </tbody>
            </table>
           </div> : null }

          

          <div className="sugg" >Suggestions: <a href="#">FB CNN </a>, <a href="#">NBC</a></div>
        </div>
        <button >Get Semple</button>
        <button >Run</button>
      </div>
    );
  }