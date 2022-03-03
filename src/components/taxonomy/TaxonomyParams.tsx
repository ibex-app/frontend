import { Tag } from '../inputs/Tag';
import { FilterElement } from '../../types/form';
import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons"
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

import './Taxonomy.css';
import fa from 'faker/locale/fa';

export function TaxonomyParams() {
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
      <div className="tax-full">
          <div className="tax-title-line">
            <div className="tax-mid">Data Collection</div>
          </div>
          <div className="tax-mid">
            <br/>
            <br/><br/>
            <b>Date range</b> <br/><br/>
          <input type="date" /> <input type="date" />

          <br/><br/>

            <b>Keywords</b> <br/><br/>
            <input type="file" /> <br/>
          <textarea className="" placeholder="keywords"></textarea><br/><br/>
           
           
           
          <b>Accounts / Platforms</b><br/><br/>
          <div className="tabs">

          <div className="tab" onClick={() => setAccountTag('input')}>Accounts</div>
          <div className="tab" onClick={() => setAccountTag('upload')}>Platforms</div>
          {/* <div className="tab" onClick={() => setAccountTag('tags')}>Use existing</div> */}
          </div>
          { accountTag == 'upload' ? <div> 
              <input type="checkbox"></input> Facebook  <br/>
              <input type="checkbox"></input> Twitter<br/>
              <input type="checkbox"></input> Youtube<br/>
              <input type="checkbox"></input> Telegram
             </div> : null }
          {/* { accountTag == 'tags' ? <div><Tag data={el}></Tag></div> : null } */}
          { accountTag == 'input' ? <div>
          <input type="file" />
            {/* <input type="text" placeholder=""/> <button>add</button> */}
            
                <div className="account"><FontAwesomeIcon icon={faFacebook} /> BBC  <FontAwesomeIcon icon={faTrashCan} /> </div>
                <div className="account"><FontAwesomeIcon icon={faYoutube} /> BBC  <FontAwesomeIcon icon={faTrashCan} /> </div>
                <div className="account"><FontAwesomeIcon icon={faTwitter} /> BBC  <FontAwesomeIcon icon={faTrashCan} /> </div>
                <div className="account"><FontAwesomeIcon icon={faFacebook} /> CNN  <FontAwesomeIcon icon={faTrashCan} /> </div>
                
           </div> : null }
           
          

          {/* <div className="sugg" >Suggestions: <a href="#">FB CNN </a>, <a href="#">NBC</a></div> */}
          <br/><br/><br/><br/>
          <a href="/taxonomy" className=""><button >Preview results</button></a>
          {/* <button >Start data collection</button> */}
        </div>
        
      </div>
    );
  }