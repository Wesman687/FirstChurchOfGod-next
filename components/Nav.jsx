import React, { useEffect, useState } from 'react'
import logo from '@/images/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function Nav() {   
    
  const [pathname, setPathName] = useState("");
  useEffect(() => {
    setPathName(window.location.pathname);
  }, []);
    return (
        <>
            <header className="top_panel_wrap top_panel_style_3 scheme_original">
                <div className="top_panel_wrap_inner top_panel_inner_style_3 top_panel_position_above">
                    <div className="top_panel_fixed_wrap"></div>
                    <div className="top_panel_middle">
                        <div className="content_wrap">
                            <div className="contact_logo">
                                <div className="logo">
                                    <Image src={logo} className="logo_main" alt="" />
                                    <Image src={logo} className="logo_fixed" alt="" />
                                </div>
                            </div>
                            <div className="menu_main_wrap">
                                <nav className="menu_main_nav_area">
                                    <ul id="menu_main" className="menu_main_nav">
                                        <Link href={'/'} className='a-link'>
                                            <li className={pathname === '/' ? 'current-link' : 'menu-item'}>
                                                Home
                                            </li>
                                        </Link>
                                        <Link href={'/about-us'}>
                                        <li className={pathname === '/about-us' ? 'current-link' : 'menu-item'}>
                                                About Us
                                            </li>
                                        </Link>
                                        
                                        <Link href={'/contacts'}>
                                        <li className={pathname === '/contacts' ? 'current-link' : 'menu-item'}>
                                            Contact Us
                                            </li>
                                        </Link>
                                        <Link href={'/gallery'}>
                                        <li className={pathname === '/gallery' ? 'current-link' : 'menu-item'}>
                                            Gallery
                                            </li>
                                        </Link>
                                        <Link href={'/donate'}>
                                        <li className='donate-btn'>
                                            Give
                                            </li>
                                        </Link>
                                        <button className='orange-btn login'>
                                            Login
                                        </button>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>            
        </>
    )
}
