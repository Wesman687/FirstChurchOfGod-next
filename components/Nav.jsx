import React from 'react'
import  logo  from '@/images/logo.webp'
import Image from 'next/image'

export default function Nav() {
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
                                            <li className="menu-item current-menu-ancestor current-menu-parent">
                                                <a href="#">Home</a>
                                            </li>
                                            <li className="menu-item">
                                                <a href="about-us.html">About Us</a>
                                                
                                            </li>
                                            <li className="menu-item">
                                                <a href="contacts.html">Contact Us</a>
                                                
                                            </li>
                                            <li class="menu-item">
                                                <a href="gallery-grid.html">Gallery</a>
                                            </li>
                                            <li class="donate-btn menu-item">
                                                <a href="donate-now.html">Give</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="header_mobile">
                    <div className="content_wrap">
                        <div className="menu_button icon-menu"></div>
                        <div className="logo">
                            <Image src={logo} className="logo_main" alt="" />
                        </div>
                    </div>
                    <div className="side_wrap">
                        <div className="close">Close</div>
                        <div className="panel_top">
                            <nav className="menu_main_nav_area">
                                <ul id="menu_main_mobile" className="menu_main_nav">
                                    <li className="menu-item current-menu-ancestor current-menu-parent menu-item-has-children">
                                    <a href="#">Home</a>
                                    </li>
                                    <li className="menu-item">
                                    <a href="about-us.html">About Us</a>                                        
                                    </li>
                                    <li className="menu-item">
                                    <a href="contacts.html">Contact Us</a>                                        
                                    </li>
                                    <li className="menu-item">
                                    <a href="gallery-grid">Gallery</a>                                        
                                    </li>
                                    <li className="donate-btn menu-item">
                                    <a href="donate-now.html">Give</a>
                                    </li>
                                </ul>
                            </nav>                            
                        </div>                         
                    </div>                         
                </div>
            </>
  )
}
