import Map from '@/components/programs/Map'
import Layout from '@/components/Layout'
import React from 'react'


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
                        <div className="sc_columns columns_wrap">
                            <div className="sc_form_address column-1_3">
                                <div className="sc_form_address_field sc_form_address_field_icon_address">
                                    <span className="sc_form_address_label">Address:</span>
                                    <span className="sc_form_address_data">2915 St Johns Ave, Palatka, FL 32177</span>
                                </div>
                                <div className="sc_form_address_field sc_form_address_field_icon_phone">
                                    <span className="sc_form_address_label">Phone number:</span>
                                    <span className="sc_form_address_data"><a href="tel:13863252814">386-385-2814</a></span>
                                </div>
                                <div className="sc_form_address_field sc_form_address_field_icon_email">
                                    <span className="sc_form_address_label">Have any questions?</span>
                                    <span className="sc_form_address_data"><a href="mailto:support@axiomthemes.com">email@email.com</a></span>
                                </div>
                                <div className="sc_form_address_field sc_form_address_field_hours">
                                    <span className="sc_form_address_label">We are open:</span>
                                    <span className="sc_form_address_data">Sunday 10AM - 2PM, Wed 2PM-4:40PM</span>
                                </div>
                            </div><div className="sc_form_fields column-2_3">
                                <form id="sc_form_1_form" data-formtype="form_2" method="post" action="include/sendmail.php">
                                    <div className="sc_form_info">
                                        <div className="sc_form_item sc_form_field label_over">
                                            <label className="required" for="sc_form_username">Name</label>
                                            <input id="sc_form_username" type="text" name="username" placeholder="Name" />
                                        </div>
                                        <div className="sc_form_item sc_form_field label_over">
                                            <label className="required" for="sc_form_email">E-mail</label>
                                            <input id="sc_form_email" type="text" name="email" placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="sc_form_item sc_form_message label_over">
                                        <label className="required" for="sc_form_message">Message</label>
                                        <textarea id="sc_form_message" name="message" placeholder="Message"></textarea>
                                    </div>
                                    <div className="sc_form_item sc_form_button">
                                        <button className="sc_button sc_button_square sc_button_style_filled sc_button_color_style_2 sc_button_size_large light-blue-button">Send Message</button>
                                    </div>
                                    <div className="result sc_infobox"></div>
                                </form>
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