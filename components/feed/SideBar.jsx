import React from 'react'
import logo from '@/images/logo.svg'
import Link from 'next/link'

function SideBar() {
  return (
    <div className='sidebar-container'>
        <Link href={'/'}><img src={logo.src}  alt='First church of God Logo' className='logo-feed' /></Link>
        <div className="sidebar-links">
            <Link href={'/'}><label>Home</label></Link>

        </div>
    </div>
  )
}

export default SideBar