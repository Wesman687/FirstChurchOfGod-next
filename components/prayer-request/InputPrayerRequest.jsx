import React, { useState } from 'react'
import { db } from '@/firebase'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import RingSpinner from '../RingSpinner'

function InputPrayerRequest({action}) {
    const [whoPrayerRequest, setWhoPrayerRequest] = useState('')
    const [prayerRequest, setPrayerRequest] = useState('')
    const [loading, setLoading] = useState(false)
    const [church, setChurch] = useState(action === 'church' ? true : false)
    const user = useSelector(state => state.user)
    async function handleSubmit() {
      if (!user.isMember){
          toast.warning('Only Members can access this resource, please sign up first.')
          router.push('/')
      }
      setLoading(true)
      const docRef = await addDoc(collection(db, 'prayer-request'), {
          prayerRequest,
          who: whoPrayerRequest,
          author: church ? 'First Church Of God' : (user.firstName + ' ' + user.lastName),
          createdAt: serverTimestamp(),
          authorUserRef: church ? 'admin' : user.userRef                
      })
      
      toast.success('Created Prayer Request')      
      setLoading(false) 
  }
    return (
        <>
        {loading ?   <><RingSpinner /></> :
            <div className='prayer-add-wrapper'>          
          <div>
              <label>{church ? 'Who does the Church want to pray for?' : 'Who do you want us to Pray for?'}</label>
              <input value={whoPrayerRequest} onChange={(e)=>setWhoPrayerRequest(e.target.value)} placeholder='Put name of who to pray for' />
          </div>
          <div>
              <label>Description:</label>
              <textarea value={prayerRequest} onChange={(e)=>setPrayerRequest(e.target.value)} placeholder='Please describe the situation that needs to be prayed for.' />
          </div>
          <button className='light-blue-button prayer-add-button' onClick={handleSubmit}>Submit Prayer Request</button>
        </div>}
    </>
    )
  }

export default InputPrayerRequest