import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function PostHeader({owner, post, username}) {
    const user = useSelector(state => state.user)  
  return (
    <>
    <div className='post-owner-container'>
                        
                            <div className='posts-owner-photoandname'>
                                
                                <img src={owner?.photoUrl} className='posts-owner-photourl' alt="" />
                                <h4>{post.name}</h4>
                                <label>@{username}</label>
                            </div>
                            <h5>{post.timeStamp &&
                                post.timeStamp
                                    .toDate()
                                    .toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true, // This makes the time format 12-hour, e.g., 10:30 AM
                                    })}</h5>
                        
                        
                    </div>
                                       
            </>
  )
}

export default PostHeader