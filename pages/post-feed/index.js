import Feed from '@/components/feed/Feed'
import SideBar from '@/components/feed/SideBar'
import Trending from '@/components/feed/Trending'
import Nav from '@/components/Nav'
import React from 'react'

function PostFeed() {
  return (
    <>
    <Nav />
        <div className='postfeed-page-wrapper'>
        <SideBar />
        <Feed />
        <Trending />
        </div>
        </>
  )
}

export default PostFeed