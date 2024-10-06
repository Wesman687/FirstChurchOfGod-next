import React from 'react'
import FeedInput from './FeedInput'
import FeedPosts from './FeedPosts'
import { useSelector } from 'react-redux'

function Feed() {
  const user = useSelector(state => state.user)
  return (
    <div className='feed-container'>
      <FeedPosts user={user} />
       <FeedInput user={user} />
    </div>
  )
}

export default Feed