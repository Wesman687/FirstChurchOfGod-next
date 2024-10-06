import React from 'react'
import FeedInput from './FeedInput'
import FeedPosts from './FeedPosts'

function Feed() {
  return (
    <div className='feed-container'>
      <FeedPosts />
       <FeedInput />
    </div>
  )
}

export default Feed