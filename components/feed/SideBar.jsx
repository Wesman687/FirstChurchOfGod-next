import React from 'react'
import logo from '@/images/logo.svg'
import Link from 'next/link'
import Image from 'next/image'

function SideBar() {
  return (
    <div className='sidebar-container'>
        <Link href={'/'}><Image src={logo} alt='First church of God Logo' className='logo-feed' width={150} height={75} /></Link>
        <div className="sidebar-links">
            <Link href={'/'}><label>Home</label></Link>

        </div>
    </div>
  )
}

export default SideBar