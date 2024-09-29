import React, { useEffect, useState } from 'react'
import logo from '@/images/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import Login from './modals/Login';
import AccountInfo from './modals/AccountInfo';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { signOutUser } from '@/redux/userSlice';

export default function Nav() {

    const [pathname, setPathName] = useState("");
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    async function logOut() {
        await signOut(auth)
        dispatch(signOutUser())
    }
    useEffect(() => {
        setPathName(window.location.pathname);
    }, []);
    return (
        <>
            <header className="top_panel_wrap top_panel_style_3 scheme_original">
                <div className="top_panel_wrap_inner top_panel_inner_style_3 top_panel_position_above nav-panel">
                    <div className="top_panel_fixed_wrap"></div>
                    <div className="top_panel_middle">
                        <div className="content_wrap">
                            <div className="contact_logo">
                                <div className="logo">
                                    <Image src={logo} className="logo_main" alt="" />
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
                                        <Link href={'/cwc'}>
                                            <li className={pathname === '/cwc' ? 'current-link' : 'menu-item'}>
                                                CWC
                                            </li>
                                        </Link>
                                        <Link href={'/gallery'}>
                                            <li className={pathname === '/gallery' ? 'current-link' : 'menu-item'}>
                                                Gallery
                                            </li>
                                        </Link>
                                        <div className="nav_link admin">
                                            {user.firstName ? (
                                                <img src={user.photoUrl} className='displayed-photourl' />
                                            ) : (<Login />)}
                                            {user.email && (
                                                <div className="admin_dropdown ">
                                                    <>
                                                        <Link href={'/calendar'}><p className='sb__link'>Calendar</p></Link>
                                                        <AccountInfo />
                                                        <p className="sb__link " onClick={() => logOut()}>
                                                            Log Out
                                                        </p>
                                                    </>
                                                </div>
                                            )}
                                        </div>
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
