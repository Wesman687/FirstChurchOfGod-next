
import React, { useState } from 'react'
import InputPrayerRequest from '../prayer-request/InputPrayerRequest'
import ListPrayerRequest from '../prayer-request/ListPrayerRequest'
import ChevronUpIcon from '../icons/ChevronUpIcon'
import ChevronDownIcon from '../icons/ChevronDownIcon'

function MyPrayerRequest() {
  const [collapseInput, setCollapseInput] = useState(false)
  return (
    <div className='prayerrequest-container'>
      <div className={collapseInput ? 'collapse-prayer-wrapper-collapsed' : 'collapse-prayer-wrapper'}>
      <h4>Pray For </h4>
        <div className='prayer-chevron prayer-chevron-up click' onClick={()=>setCollapseInput((prev)=> !prev)}>
          {collapseInput ? <ChevronDownIcon classes={'red icon-small'} />  : <ChevronUpIcon classes={'red icon-small '} />}
        </div>
            {!collapseInput && <InputPrayerRequest />}
      </div>
      
      <ListPrayerRequest  action={'self'} />
    </div>
  )
}

export default MyPrayerRequest