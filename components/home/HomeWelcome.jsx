import React from 'react'
import ChurchImage from '@/images/firstchurchofgod2.jpg'
import Image from 'next/image'
import HouseIcon from '../icons/HouseIcon'
import BookIcon from '../icons/BookIcon'
import User from '../icons/User'
import art from '@/images/art_sign_up.png'
import Link from 'next/link'

function HomeWelcome() {

    return (
        <div className="home-container">
            <div className="content_wrap">
                    <Link href="/camp" className="art-sign-up-link">
                        <Image width={250} src={art} alt='art' className='art-sign-up' />
                    </Link>
                    
        
                <div className="columns_wrap welcome_wrapper">
                    <div className=" home-welcome-image-wrapper">
                            <Image width={650} height={350}  src={ChurchImage} className='home-welcome-image' alt="" />
                     
                    </div>
                    <div className=" even">
                        <h6 className="home-top-paragraph">Welcome</h6>
                        <h2 className="sc_services_title sc_item_title home-welcome-title">Loving God, Loving Others and Serving the Lord</h2>
                        <p className='home-welcome-title-paragraph'>Wed love to meet you! Come check us out this SUNDAY where you can meet us and see if The <span className='bold'>First Church of God</span>  might be a good fit for you. Our heart and soul is to introduce and connect people with the living and powerful God.</p>
                        <div className="sc_services_wrap">

                            <div className="home-welcome-wrapper sc_services_item_title  sc_services_style_services-5 sc_services_type_icons sc_slider_nopagination sc_slider_nocontrols width_100_per">

                                <div className="home-welcome-item">
                                    <HouseIcon classes={"med-icon home-icons"} />
                                    <div className="sc_services_item_content">
                                        <h4 className="sc_services_item_title home-welcome-subtitle">
                                            Follow with us
                                        </h4>
                                        <div className="sc_services_item_description">
                                            <p>We would love to see you and your family &amp; friends this weekend in our church at 10 am.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="home-welcome-item">
                                    <BookIcon classes={"med-icon home-icons"} />
                                    <div className="sc_services_item_content">
                                        <h4 className="sc_services_item_title home-welcome-subtitle">
                                            What We Believe</h4>
                                        <div className="sc_services_item_description home-welcome-items-paragraph">
                                            <p className='home-welcome-items-paragraph'>We believe that the Bible is God’s Word. It is accurate, authoritative and applicable to our everyday lives.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="home-welcome-item">
                                    <User classes={"home-icons"} />
                                    <div className="sc_services_item_content">
                                        <h4 className="sc_services_item_title home-welcome-subtitle">
                                            New Here?
                                        </h4>
                                        <div className="sc_services_item_description">
                                            <p>Tell us about yourself to begin your journey with connecting to our community.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HomeWelcome