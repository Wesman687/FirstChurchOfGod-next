import React, { useState, useEffect } from "react";
import logo from "@/images/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Login from "./modals/Login";
import AccountInfo from "./modals/AccountInfo";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { signOutUser } from "@/redux/userSlice";

export default function Nav() {
  const [pathname, setPathName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // 🔥 Menu state
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setPathName(window.location.pathname);
  }, []);

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

          {/* Hamburger Menu Button */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={menuOpen ? "bar open" : "bar"}></div>
            <div className={menuOpen ? "bar open" : "bar"}></div>
            <div className={menuOpen ? "bar open" : "bar"}></div>
          </div>

          {/* Navigation Menu */}
          <nav className={menuOpen ? "nav-menu open" : "nav-menu"}>
            <ul className="menu_main_nav">
              <Link href={"/"} className="a-link">
                <li className={pathname === "/" ? "current-link" : "menu-item"}>
                  Home
                </li>
              </Link>
              <Link href={"/about-us"}>
                <li
                  className={pathname === "/about-us" ? "current-link" : "menu-item"}
                >
                  About Us
                </li>
              </Link>
              <Link href={"/contacts"}>
                <li
                  className={pathname === "/contacts" ? "current-link" : "menu-item"}
                >
                  Contact Us
                </li>
              </Link>
              <Link href={"/cwc"}>
                <li className={pathname === "/cwc" ? "current-link" : "menu-item"}>
                  CWC
                </li>
              </Link>
              <Link href={"/camp"}>
                <li className={pathname === "/camp" ? "current-link" : "menu-item"}>
                  CAMP
                </li>
              </Link>
              <Link href={"/gallery"}>
                <li className={pathname === "/gallery" ? "current-link" : "menu-item"}>
                  Gallery
                </li>
              </Link>

              {/* Admin Section */}
              <div className="nav_link admin">
                {user.firstName ? (
                  <img src={user.photoUrl} className="displayed-photourl" alt="User" />
                ) : (
                  <Login />
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
              </div>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
