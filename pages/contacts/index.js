import Map from '@/components/programs/Map'
import Layout from '@/components/Layout'
import React from 'react'
import fblogo from '@/images/fb-logo.png'
import ContactForm from '@/components/programs/ContactForm'
import HouseIcon from '@/components/icons/HouseIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'
import MailIcon from '@/components/icons/MailIcon'
import SmileIcon from '@/components/icons/SmileIcon'
import Image from 'next/image'

function Contacts() {
    return (
        <Layout>
            <div className="contact-wrapper">
                <h1 className="contact-header-text">Contact Us</h1>

                        <div id="sc_form_1" className="sc_form sc_form_style_form_2 aligncenter paragraph-container">
                            <h2 className="sc_form_title sc_item_title light-blue contact-title">Get in Touch With Us</h2>
                            <div className="contact-paragraph">We welcome visitors at First Church of God and would love to have you join us in church this weekend.</div>
                            <div className="contact-wrap">
                                <div className="sc_form_address">
                                    <div className="contact-label-wrap">
                                        <div className='contact-item-wrapper'>
                                            <HouseIcon classes={"light-blue contact-item"} />
                                        </div>
                                        <div className="contact-label-wrap-text">
                                            <span className="contact-label">Address:</span>
                                            <span className="contact-label2">2915 St Johns Ave, Palatka, FL 32177</span>
                                        </div>
                                    </div>

                                    <div className="contact-label-wrap">
                                        <div className='contact-item-wrapper'>
                                            <PhoneIcon classes={"light-blue contact-item"} />
                                        </div>
                                        <div className="contact-label-wrap-text">
                                            <span className="contact-label">Phone number:</span>
                                            <span className="contact-label2"><a href="tel:13863252814">386-546-0143</a></span>
                                        </div>

                                    </div>

                                    <div className="contact-label-wrap">
                                        <div className='contact-item-wrapper'>
                                            <MailIcon classes={"light-blue contact-item"} />
                                        </div>
                                        <div className="contact-label-wrap-text">
                                            <span className="contact-label">Have any questions?</span>
                                            <span className="contact-label2"><a href="mailto:support@axiomthemes.com">email@email.com</a></span>
                                        </div>
                                    </div>

                                    <div className="contact-label-wrap">
                                        <div className='contact-item-wrapper'>
                                            <SmileIcon classes={"light-blue contact-item"} />
                                        </div>
                                        <div className="contact-label-wrap-text">
                                            <span className="contact-label">We are open:</span>
                                            <span className="contact-label2">Sunday 10AM - 2PM, Wed 2PM-4:40PM</span>
                                        </div>
                                    </div>

                                    <div className="contact-label-wrap">
                                        <div className='contact-item-wrapper'>
                                            <Image src={fblogo} alt="fb logo" className="contact-fb-logo contact-item" unoptimized />
                                        </div>
                                        <div className="contact-label-wrap-text">
                                            <span className="contact-label">See us on Face Book:</span>
                                            <span className="contact-label2"><a href="https://www.facebook.com/profile.php?id=100088621011528">First Church of God - Palatka</a></span>
                                        </div>
                                    </div>

                                </div>
                                <div className="sc_form_fields column-2_3">

                                    <ContactForm />
                                </div>
                            </div>
                    </div>
            </div>
            { }
            <Map />


        </Layout>
    )
}

export default Contacts