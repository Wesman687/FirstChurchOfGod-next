import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ChevronUpIcon from '../icons/ChevronUpIcon'
import DotsIcon from '../icons/DotsIcon'

function PostHeader({ timeStamp, name, photoUrl, username, setCollapsePost, confirmRemoveMember, setEdit, edit, dotsOn: existingdotsOn, owner }) {
    const user = useSelector(state => state.user)
    const [dotsOn, setDotsOn] = useState(existingdotsOn !== undefined ? existingdotsOn : true)
    
    return (
        <>

            <div className='post-owner-container'>
                <div className="post-header">
                    {dotsOn && <div className='post-feed-chevron click' onClick={() => setCollapsePost((prev) => !prev)}>
                        <ChevronUpIcon classes={'white icon-small '} />
                    </div>}
                    <div className='posts-owner-photoandname'>

                        {photoUrl && <img src={photoUrl} className='posts-owner-photourl' alt="" />}
                        <h4>{name}</h4>
                        <label>@{username}</label>
                    </div>
                </div>
                
                <h5>{timeStamp &&
                        timeStamp
                            .toDate()
                            .toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true, // This makes the time format 12-hour, e.g., 10:30 AM
                            })}</h5>
                            {(user.isAdmin || user.userRef === owner) && 
                <div className='post-dropdown'>
                    <div className='list-prayer-item-chevron'>
                        {dotsOn && <DotsIcon classes={'white icon-small'} />}
                    </div>
                     <div className='post-prayer-menudropdown'>
                        <><label className='click' onClick={() => setEdit((prev) => !prev)}>{edit ? 'Cancel Edit' : 'Edit'}</label>
                            <label className='click' onClick={() => confirmRemoveMember()}>Remove</label></>
                    </div>
                </div>}
            </div>
        </>
    )
}

export default PostHeader