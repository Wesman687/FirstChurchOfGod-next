import React from 'react'

function PostInfo({ post }) {
    return (
        <div className='post-info-container'>
            <h4>{post.comment}</h4>
            {post.image && <img src={post.image} className='post-image' alt='Image' />}
        </div>
    )
}

export default PostInfo