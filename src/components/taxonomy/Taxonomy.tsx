import { Tag } from '../inputs/Tag';
import { FilterElement } from '../../types/form';
import { useEffect, useMemo, useState } from 'react';
import { Table } from '../table/Table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons"
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

import { faThumbsUp, faFileArrowUp } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';

export function Taxonomy() {
    const [keywordTag, setKeywordTag] = useState('input')
    const [accountTag, setAccountTag] = useState('input')
    
    

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
      <div>
      <div className="leftbox">
        <div>
          <input type="text" placeholder="Name"></input>
          <textarea className="" placeholder="Description"></textarea>
          <br/><br/><b>Date range</b><br/><br/>

          <input type="date" />
          <br/>
          <br/><br/><b>Keywords</b> <FontAwesomeIcon className="upload-btn" icon={faFileArrowUp} /><br/><br/>

          <div className="tabs">
            {/* <div className="tab" onClick={() => setKeywordTag('upload')}>Upload</div> */}
            {/* <div className="tab" onClick={() => setKeywordTag('input')}>Input manulay</div> */}
            {/* <div className="tab" onClick={() => setKeywordTag('tags')}>Use existing</div> */}
          </div>
          {/* { keywordTag == 'upload' ? <div> <input type="file" /> </div> : null } */}
          { keywordTag == 'tags' ? <div><Tag data={el}></Tag></div> : null }
          { keywordTag == 'input' ? <div>
            <input type="text" placeholder=""/> 
            {/* <button>add</button> */}
            <table>
              {/* <thead><tr><td>Keyword</td><td>Results</td><td>Match</td></tr></thead> */}
              <tbody>
                <tr><td>Violance</td><td></td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                <tr><td>Gaza OR Yemen</td><td></td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                <tr><td>Gaza NOT Nablus</td><td></td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                <tr><td>Violance</td><td></td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                </tbody>
            </table>
           </div> : null }
           {/* <div className="sugg" >Suggestions: <a href="#">Israel</a>, <a href="#">Hamas</a></div> */}

           <br/><br/><b>Accounts</b> <FontAwesomeIcon className="upload-btn" icon={faFileArrowUp} /><br/><br/>

          <div className="tabs">

          {/* <div className="tab" onClick={() => setAccountTag('upload')}>Upload</div> */}
          {/* <div className="tab" onClick={() => setAccountTag('input')}>Input manulay</div> */}
          {/* <div className="tab" onClick={() => setAccountTag('tags')}>Use existing</div> */}
          </div>
          {/* { accountTag == 'upload' ? <div> <input type="file" /> </div> : null } */}
          { accountTag == 'tags' ? <div><Tag data={el}></Tag></div> : null }
          { accountTag == 'input' ? <div>
            <input type="text" placeholder=""/> 
            {/* <button>add</button> */}
            <table>
              {/* <thead><tr><td>Acc</td><td>Platform</td><td>Match</td></tr></thead> */}
              <tbody>
                <tr><td><FontAwesomeIcon icon={faFacebook} /> BBC</td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                <tr><td><FontAwesomeIcon icon={faTwitter} /> BBC</td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                <tr><td><FontAwesomeIcon icon={faYoutube} /> BBC</td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                <tr><td><FontAwesomeIcon icon={faTwitter} /> CNN</td><td><FontAwesomeIcon icon={faTrashCan} /></td></tr>
                </tbody>
            </table>
           </div> : null }
           
          

          {/* <div className="sugg" >Suggestions: <a href="#">FB CNN </a>, <a href="#">NBC</a></div> */}
        </div>
        <button className='left-m-5'>Get Semple</button>
        {/* <button >Run</button> */}
        
      </div>
      {<Table />} 
      </div> 
    );
  }