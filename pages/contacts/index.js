import Map from '@/components/programs/Map'
import Layout from '@/components/Layout'
import React from 'react'
import ContactForm from '@/components/programs/ContactForm'
import HouseIcon from '@/components/icons/HouseIcon'
import PhoneIcon from '@/components/icons/PhoneIcon'
import MailIcon from '@/components/icons/MailIcon'
import SmileIcon from '@/components/icons/SmileIcon'

function Contacts() {
    return (
        <Layout>
            <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
                <div className="top_panel_title_inner top_panel_inner_style_3 contact-header">
                    <div className="content_wrap">
                        <h1 className="page_title contact-header-text">Contact Us</h1>
                    </div>
                </div>
            </div>
            <div className="content_wrap padding_top_5_2857em padding_bottom_6_1429em">
                <div id="sc_form_1_wrap" className="sc_form_wrap ">
                    <div id="sc_form_1" className="sc_form sc_form_style_form_2 aligncenter">
                        <h6 className="sc_form_subtitle sc_item_subtitle">Contact Form</h6>
                        <h2 className="sc_form_title sc_item_title">Get in Touch With Us</h2>
                        <div className="sc_form_descr sc_item_descr">We welcome visitors at First Church of God and would love to have you join us in church this weekend.</div>
                        <div className="contact-wrap">
                            <div className="sc_form_address column-1_3">
                                <div className="contact-label-wrap">
                                    <HouseIcon classes={"icon-small light-blue contact-item"}/>
                                    <div className="contact-label-wrap-text">
                                    <span className="contact-label">Address:</span>
                                    <span className="contact-label2">2915 St Johns Ave, Palatka, FL 32177</span>
                                    </div>
                                </div>

                                <div className="contact-label-wrap">
                                    <PhoneIcon classes={"icon-small light-blue contact-item"}/>
                                    <div className="contact-label-wrap-text">
                                    <span className="contact-label">Phone number:</span>
                                    <span className="contact-label2"><a href="tel:13863252814">386-546-0143</a></span>
                                    </div>

                                </div>

                                <div className="contact-label-wrap">
                                    <MailIcon classes={"icon-small light-blue contact-item"}/>
                                    <div className="contact-label-wrap-text">
                                    <span className="contact-label">Have any questions?</span>
                                    <span className="contact-label2"><a href="mailto:support@axiomthemes.com">email@email.com</a></span>
                                    </div>


                                </div>
                                <div className="contact-label-wrap">
                                    <SmileIcon classes={"md-icon light-blue contact-item"}/>
                                    <div className="contact-label-wrap-text">
                                    <span className="contact-label">We are open:</span>



                                    <span className="contact-label2">Sunday 10AM - 2PM, Wed 2PM-4:40PM</span>
                                    </div>
                                </div>
                            </div>
                            <div className="sc_form_fields column-2_3">

                                    <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Map />


        </Layout>
    )
}

export default Contacts