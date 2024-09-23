import React from 'react'
import ChurchImage from '@/images/church_foto.jpg'
import Image from 'next/image'

function HomeWelcome() {
    return (
        <div className="hp1_welcome_section">
            <div className="content_wrap">
                <div className="columns_wrap">
                    <div className="column-1_2 sc_column_item sc_column_item_1 odd first">
                        <figure className="sc_image sc_image_shape_square">
                            <a href="service-single.html">
                                <Image src={ChurchImage} alt="" />
                            </a>
                        </figure>
                    </div>
                    <div className="column-1_2 sc_column_item sc_column_item_2 even">

                        <div className="sc_services_wrap">
                            <div className="sc_services sc_services_style_services-5 sc_services_type_icons sc_slider_nopagination sc_slider_nocontrols width_100_per" data-interval="5040" data-slides-min-width="250">
                                <h6 className="sc_services_subtitle sc_item_subtitle">Welcome</h6>
                                <h2 className="sc_services_title sc_item_title">Loving God, Loving Others and Serving the Lord</h2>
                                <div className="sc_services_descr sc_item_descr">We’d love to meet you! Come check us out this SUNDAY where you can meet us and see if New Life Church might be a good fit for you. Our heart and soul is to introduce and connect people with the living and powerful God.</div>
                                <div className="sc_services_item sc_services_item_1 odd first">
                                    <span className="sc_icon icon-house306"></span>
                                    <div className="sc_services_item_content">
                                        <h4 className="sc_services_item_title">
                                            <a href="service-single.html">Follow with us</a>
                                        </h4>
                                        <div className="sc_services_item_description">
                                            <p>We would love to see you and your family &amp; friends this weekend in our church at 10 am.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sc_services_item sc_services_item_2 even">
                                    <span className="sc_icon icon-open-book6"></span>
                                    <div className="sc_services_item_content">
                                        <h4 className="sc_services_item_title">
                                            <a href="service-single.html">What We Believe</a></h4>
                                        <div className="sc_services_item_description">
                                            <p>We believe that the Bible is God’s Word. It is accurate, authoritative and applicable to our everyday lives.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="sc_services_item sc_services_item_3 odd">
                                    <span className="sc_icon icon-avatar110"></span>
                                    <div className="sc_services_item_content">
                                        <h4 className="sc_services_item_title">
                                            <a href="service-single.html">New Here?</a>
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