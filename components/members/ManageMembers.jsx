import { db } from '@/firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import RingSpinner from '../RingSpinner'
import CheckIcon from '../icons/CheckIcon'
import XIcon from '../icons/XIcon'
import { useSelector } from 'react-redux'
import MemberModal from '../modals/MemberModal'
import { toast } from 'react-toastify'

function ManageMembers() {
    const [memberList, setMemberList] = useState([])
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user)
    const [selectedMember, setSelectedMember] = useState(null); // To store clicked member
    const [modalVisible, setModalVisible] = useState(false); // Control modal visibility    
    const handleMemberClick = (member) => {
        if (!user.isAdmin){
            return
        }
        setSelectedMember(member); // Set the selected member
        setModalVisible(true); // Show the modal
    };
    const closeModal = () => {
        setModalVisible(false);
        setSelectedMember(null); // Reset when modal is closed
    };
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
            <tbody clas>
                {memberList.map((item, index)=> (
                  <>
                <tr className='managemembers-table-tbody-row' onClick={() => handleMemberClick(item)}>
                    <td className='click' onClick={() => handleMemberClick(item)}>{item.firstName + ' ' + item.lastName}</td>
                    <td>{item.email}</td>
                    <td className='text-center click'><img src={item.photoUrl} className='managemembers-image' /></td>
                    <td className='text-center click'>{item.phone}</td>
                    <td className='text-center click'>{item.isMember ? <CheckIcon classes={'green '} /> : <XIcon classes={'bright-red xicon-shadow'} /> }</td>
                    <td className='text-center click'>{item.isAdmin ? <CheckIcon classes={'green '} /> : <XIcon classes={'bright-red xicon-shadow'} /> }</td>
                    <td className='text-center click'>{item.isSuper ? <CheckIcon classes={'green '} /> : <XIcon classes={'bright-red xicon-shadow'} /> }</td>
                </tr>
                </>
                ))}
            </tbody>
        </table>
        {modalVisible && (
                        <MemberModal member={selectedMember} onClose={closeModal} />
                    )}
        <div className='managemembers-wrapper'>
            
        </div>  
    </>     : <><div><RingSpinner /></div></>}</div>
  )
}

export default ManageMembers