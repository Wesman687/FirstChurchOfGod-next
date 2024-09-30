import { db } from '@/firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import RingSpinner from '../RingSpinner'
import CheckIcon from '../icons/CheckIcon'
import XIcon from '../icons/XIcon'

function ManageMembers() {
    const [memberList, setMemberList] = useState([])
    const [loading, setLoading] = useState(false)
    console.log(memberList)
    useEffect(()=>{
        const q = query(collection(db, 'user'))        
        const unsubscribe = onSnapshot(q, (snapshot) =>{
            const data = snapshot.docs
            setMemberList(data.map(item => item.data()))
        })
        return unsubscribe
    },[])
  return (
    <div className='managemembers-container'>{(memberList.length > 0 && !loading ) ?  
        <>
        <table className='managemembers-table'>
            <thead>
                <tr className='managemembers-table-thead-row'>
                    <td>Name</td>
                    <td>Email</td>
                    <td>Photo</td>
                    <td>Phone</td>
                    <td>Member</td>
                    <td>Admin</td>
                    <td>Super Admin</td>
                </tr>
            </thead>
            <tbody>
                {memberList.map((item, index)=> (
                  <>
                <tr className='managemembers-table-tbody-row'>
                    <td>{item.firstName + ' ' + item.lastName}</td>
                    <td>{item.email}</td>
                    <td className='text-center'><img src={item.photoUrl} className='managemembers-image' /></td>
                    <td className='text-center'>Phone</td>
                    <td className='text-center'>Member</td>
                    <td className='text-center'>{<XIcon classes={'red'} />}</td>
                    <td className='text-center'>{<CheckIcon classes={'green'} />}</td>
                </tr>
                </>
                ))}
            </tbody>
        </table>
        <div className='managemembers-wrapper'>
            
        </div>  
    </>     : <><div><RingSpinner /></div></>}</div>
  )
}

export default ManageMembers