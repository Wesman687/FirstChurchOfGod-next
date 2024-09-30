import React from 'react'
import Login from '../modals/Login'

function HomeBottom() {
    return (
        <div className="hp1_join_us_section accent1_bgc">
            <div className="content_wrap">
                <div className="columns_wrap sc_columns columns_nofluid sc_columns_count_4 column_resizer">
                    <div className="column-2_4 sc_column_item sc_column_item_1 odd first span_2">
                        <h2 className="hp1_join_us_info custom_heading_1">If you are interested in Becoming a member, Sign Up here, and we will get back with you shortly.</h2>
                    </div><div className="column-1_4 sc_column_item sc_column_item_3 odd after_span_2">
                        <div className="sc_section join_us_custom_block_1">
                            <div className="sc_section_inner">
                                <h6 className="sc_title sc_title_regular margin_top_null tpl_light margin_bottom_2">Email Us</h6>
                                <h4 className="sc_title sc_title_regular underline margin_top_null margin_bottom_null tpl_light">
                                    <a className="tpl_light" href="#">info@yoursite.com</a>
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="column-1_4 sc_column_item sc_column_item_4 even text_align_center margin_top_0_5em">
                        <div className="outline-button"><Login defaultState={'Sign Up'} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeBottom