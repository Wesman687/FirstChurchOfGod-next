import { db } from '@/firebase'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import EditIcon from '../icons/EditIcon'
import TrashIcon from '../icons/TrashIcon'
import ArrowUturnLeftIcon from '../icons/ArrowUturnLeftIcon'

function ManageFilters() {
    const [newFilter, setNewFilter] = useState('')
    const [inputs, setInputs] = useState([])
    const [editFilter, setEditFilter] = useState('')
    const [editing, setEditing] = useState(false)
    const [editIndex, setEditIndex] = useState()
    const [originalEditFilter, setOriginalEditFilter] = useState('')
    async function handleAdd() {
        const docRef = await addDoc(collection(db, 'filters'), {
            filter: newFilter
        })
        setNewFilter('')
    }
    async function handleRemove({index}) {
        console.log(inputs[index].id)
        await deleteDoc(doc(db, 'filters', inputs[index].id))
    }
    async function handleEdit({index}){
        setEditing(true)
        setEditIndex(index)
        setEditFilter(inputs[index].data().filter)
        setOriginalEditFilter(inputs[index].data().filter)

    }
    function handleClear(){
        setEditing(false)
        setEditIndex(null)
        setEditFilter('')
        setOriginalEditFilter('')
    }
    async function handleUpdate(){
        await updateDoc(doc(db, 'filters', inputs[editIndex].id), {
            filter: editFilter
        })
        handleClear()
    }
    useEffect(()=>{
        const q = query(collection(db, 'filters'))        
        const unsubscribe = onSnapshot(q, (snapshot) =>{
            const data = snapshot.docs
            setInputs(data)
        })
        return unsubscribe
    },[])
    return (
        <div className='manage-gallery-section'>
            <h2>Manage Galleries</h2>
            <div className='filter-input-container'>
                {editing ?  
                <><label className='filter-input-label'>Edit {originalEditFilter}: </label>
                <div className='filter-input-w-button'>
                    <input className='filter-input' value={editFilter} onChange={(e) => setEditFilter(e.target.value)} placeholder={originalEditFilter}>
                    </input>
                    <div className='clear-edit-container'>
                    <button className={editFilter !== originalEditFilter && 'filter-add'} onClick={handleUpdate}>Update</button>
                    <figure className='input-left-icon' onClick={handleClear}>
                    <ArrowUturnLeftIcon />
                    </figure>
                    </div>
                </div></>
                
                : <><label className='filter-input-label'>Add Gallery: </label>
                <div className='filter-input-w-button'>
                    <input className='filter-input' value={newFilter} onChange={(e) => setNewFilter(e.target.value)} placeholder='Gallery Name'>
                    </input>
                    <button className={newFilter.length > 0 && 'filter-add'} onClick={handleAdd}>Add</button>
                </div></>}
            </div>
            <div className='filters-list-container'>
                <table>
                <thead>
                    <tr>
                        <td>Gallery Name</td>
                        <td className='edit-remove-column'>Edit/Remove</td>
                    </tr>
                </thead>
                <tbody>
                    
                        {inputs.length > 0 && inputs.map((item, index) => (
                            <>
                            <tr key={index}>
                            
                            <td>{item.data().filter}</td>
                        <td className='edit-remove-column'>
                            <div>
                            <label className='filter-edit-button' onClick={()=>handleEdit({index})} ><EditIcon /> Edit</label>
                            </div>
                            <div>
                            <label className='filter-remove-button red-button' onClick={()=>handleRemove({index})}><TrashIcon /> Remove</label>
                            </div>
                        </td>
                        
                        </tr>
                        </>
                        ))}
                    
                </tbody>
                </table>
            </div>

        </div>
    )
}

export default ManageFilters