import React, { useState, useEffect } from "react";
import logo from "@/images/logo.svg";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Login from "./modals/Login";
import AccountInfo from "./modals/AccountInfo";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { signOutUser } from "@/redux/userSlice";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Nav() {
  const [pathname, setPathName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setPathName(window.location.pathname);
  }, []);

  // ✅ Update pathname when router changes
  useEffect(() => {
    const handleRouteChange = (url) => {
      setPathName(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Cleanup function
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // ✅ Handle closing animation
  const handleCloseMenu = () => {
      setMenuOpen(false);
      setIsClosing(false);
  };

  // ✅ Also update pathname immediately when using handleLink
  const handleLink = (link) => {
    setPathName(link); // Update pathname immediately for instant UI feedback
    router.push(link);
    if (menuOpen) {
      handleCloseMenu();
    }
  };

  async function logOut() {
    await signOut(auth);
    dispatch(signOutUser());
  }

  return (
    <>
      <header className="nav-header">
        <div className="nav_content_wrap">
          {/* Logo */}
          <div className="contact_logo">
            <Image src={logo} className="logo_main" alt="Logo" />
          </div>

          {/* ✅ Hamburger Menu Button */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => (menuOpen ? handleCloseMenu() : setMenuOpen(true))}
          >
            {menuOpen ? (
              <p className="nav-x">X</p>
            ) : (
              <>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </>
            )}
          </div>

          {/* ✅ Full-screen Navigation Menu */}
          <nav className={`nav-menu ${menuOpen ? "open" : ""} ${isClosing ? "closing" : ""}`}>
            <ul className="menu_main_nav">
              <li className={pathname === "/" ? "current-link" : "menu-item"} onClick={() => handleLink("/")}>
                Home
              </li>
              <li className={pathname === "/about-us" ? "current-link" : "menu-item"} onClick={() => handleLink("/about-us")}>
                About Us
              </li>
              <li className={pathname === "/contacts" ? "current-link" : "menu-item"} onClick={() => handleLink("/contacts")}>
                Contact Us
              </li>
              <li className={pathname === "/cwc" ? "current-link" : "menu-item"} onClick={() => handleLink("/cwc")}>
                CWC
              </li>
              {/* <li className={pathname === "/camp" ? "current-link" : "menu-item"} onClick={() => handleLink("/camp")}>
                Camp
              </li> */}
              <li className={pathname === "/gallery" ? "current-link" : "menu-item"} onClick={() => handleLink("/gallery")}>
                Gallery
              </li>
              <li className={pathname === "/videos" ? "current-link" : "menu-item"} onClick={() => handleLink("/videos")}>
                Videos 
              </li>
              <li className={pathname === "/calendar" ? "current-link" : "menu-item"} onClick={() => handleLink("/calendar")}>
                Calendar 
              </li>

              {/* Admin Section */}
              <div className="nav_link admin">
                {user.firstName ? (
                  <>
                    <Image src={user.photoUrl} className="displayed-photourl" alt="User" width={40} height={40} />
                  </>
                ) : (
                  <Login classes={"menu-item"}/>
                )}

                {user.email && (
                  <div className="admin_dropdown">
                    <>
                      {user.isMember && (
                        <>
                          <Link href={"/members"}>
                            <p className="sb__link">Member Area</p>
                          </Link>
                          <Link href={"/prayer-request"}>
                            <p className="sb__link">Prayer Request</p>
                          </Link>
                          <Link href={"/post-feed"}>
                            <p className="sb__link">Post Feed</p>
                          </Link>
                          <Link href={"/calendar"}>
                            <p className="sb__link">Calendar</p>
                          </Link>
                        </>
                      )}
                      <AccountInfo />
                      <p className="sb__link" onClick={logOut}>
                        Log Out
                      </p>
                    </>
                  </div>
                )}
                {user.email && (
                <div className="nav-member-mobile">
                  <Image src={user.photoUrl} className="displayed-photourl-mobile" alt="User" width={40} height={40} />
                  <div className="nav-member-mobile-sub">
                    <div>
                      <p className={pathname == "/members" ? "nav-member-mobile-active"  : "sb__link"} onClick={() => handleLink("/members")}>Member Area</p>
                      <p className="sb__link" onClick={() => handleLink("/prayer-request")}>Prayer Request</p>
                      <AccountInfo />
                    </div>
                    <div>
                      <p className="sb__link" onClick={() => handleLink("/post-feed")}>Post Feed</p>
                      <p className="sb__link" onClick={() => handleLink("/calendar")}>Calendar</p>
                      <p className="sb__link" onClick={logOut}>Log Out</p>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
