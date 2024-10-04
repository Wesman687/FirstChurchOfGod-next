import { db } from '@/firebase'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import RingSpinner from '../RingSpinner'
import ChevronDownIcon from '../icons/ChevronDownIcon'
import { toast } from 'react-toastify'

function ListPrayerRequest({ action }) {
    const [prayerRequestList, setPrayerRequestList] = useState([])
    const [loading, setLoading] = useState(false)
    const user = useSelector(state => state.user)
    const [editedRequests, setEditedRequests] = useState({}); // Store edits
    const handleInputChange = (id, field, value) => {
        setEditedRequests(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };
    const handleRemove = async (id) => {
        setLoading(true);
        try {
          const docRef = doc(db, 'prayer-request', id);
          await deleteDoc(docRef); // Delete the document from Firestore
          toast.success('Prayer request removed!');
        } catch (error) {
          toast.error('Error removing prayer request:', error);
        }
        setLoading(false);
      };
    const handleUpdate = async (id) => {
        const originalRequest = prayerRequestList.find(item => item.id === id);
    
        if (!originalRequest) return;  // Safety check in case the item is missing
    
        setLoading(true);
    
        // Fallback to original data if a field hasn't been edited
        const updatedWho = editedRequests[id]?.who ?? originalRequest.who;
        const updatedPrayerRequest = editedRequests[id]?.prayerRequest ?? originalRequest.prayerRequest;      
        try {
            const docRef = doc(db, 'prayer-request', id);
            await updateDoc(docRef, {
                who: updatedWho,
                prayerRequest: updatedPrayerRequest,
            });
            toast.success('Prayer request updated!');
        } catch (error) {
            toast.error('Error updating prayer request:', error);        }
    
        setLoading(false);
    };
    const autoResize = (e) => {
        e.target.style.height = 'auto'; // Reset the height to calculate new height
        e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on content
      };
    useEffect(() => {
        setLoading(true)
        const q = query(collection(db, 'prayer-request'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let data = snapshot.docs.map(doc => ({
                id: doc.id,  // Add the document ID
                ...doc.data() // Spread the rest of the document data
              }));
            if (action === 'self') {
                data = data.filter(item => user.userRef === item.authorUserRef)
            }
            setPrayerRequestList(data)
            setLoading(false)
        })
        return unsubscribe
    }, [])
    return (
        <div className='list-prayer-container'>
            {loading ? <><RingSpinner /></> : <>
                {prayerRequestList.length > 0 && prayerRequestList.map((item, index) => (
                    <div key={index} className='list-prayer-item'>
                        <div className='list-prayer-item-title'>
                            <label><span className='bold'>{item.author}</span> ask us to pray for {(item.authorUserRef === user.userRef || user.isAdmin) ? <input
                                className='bold light-blue list-prayer-input'
                                value={editedRequests[item.id]?.who || item.who}
                                onChange={(e) => handleInputChange(item.id, 'who', e.target.value)}
                            /> : <span className='bold light-blue'>{item.who}</span>}</label>
                            <label>
                                {item.createdAt &&
                                    item.createdAt
                                        .toDate()
                                        .toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true, // This makes the time format 12-hour, e.g., 10:30 AM
                                        })}
                            </label>
                            {(item.authorUserRef === user.userRef || user.isAdmin) && <div className='list-prayer-dropdown'>
                                <div className='list-prayer-item-chevron'>
                                    <ChevronDownIcon classes={'icon-small'} />
                                </div>
                                <div className='list-prayer-item-addremove'>
                                    <label onClick={() => handleUpdate(item.id)}>Update</label>
                                    <label onClick={() => handleRemove(item.id)}>Remove</label>
                                </div>
                            </div>}
                        </div>
                        <div className='list-prayer-item-desc'>
                            {(item.authorUserRef === user.userRef || user.isAdmin) ? <textarea className='list-prayer-textarea bold'
                                value={editedRequests[item.id]?.prayerRequest || item.prayerRequest}
                                onInput={autoResize}
                                onChange={(e) => handleInputChange(item.id, 'prayerRequest', e.target.value)}
                            /> : <h4>{item.prayerRequest}</h4>}
                        </div>
                        {(item.authorUserRef === user.userRef) && <label className='list-prayer-disclaimer'>As the owner of this prayer request, you can change the pray for area, as well as the description area.</label>}

                    </div>
                ))}
            </>}
            
            {prayerRequestList.length === 0 && <h4>Posts your first Prayer Request</h4>}
        </div>
    )
}

export default ListPrayerRequest