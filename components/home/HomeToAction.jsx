import Image from 'next/image'
import React from 'react'
import cwc from '@/images/cwc/CWC-Mission-Slides-1.jpg'
import Link from 'next/link'

function HomeToAction() {
    return (
        <div className="hp1_call_to_action_section">
            <div className="sc_call_to_action sc_call_to_action_style_1 sc_call_to_action_align_left sc_call_to_action_color_style_1 width_100_per">
                <div className="content_wrap">
                    <div className="columns_wrap">
                        <div className="sc_call_to_action_featured column-1_2">
                            <Image src={cwc} className='cwc-homepage-image' alt=""  />
                        </div>
                        <div className="sc_call_to_action_info column-1_2 home-cwc-wrapper">
                            
                            <h2 className="sc_call_to_action_title sc_item_title">Christian Women Connection</h2>
                            <div className="sc_call_to_action_descr sc_item_descr">Discover a global network of women ready to live out their calling.</div>
                            <div className="sc_call_to_action_buttons sc_item_buttons">
                                <div className="sc_call_to_action_button sc_item_button home-cwc-button-wrapper">
                                    <Link href={'/cwc'}>
                                    <label className="click sc_button sc_button_square sc_button_style_filled sc_button_color_style_2 sc_button_size_large orange-btn home-cwc-button">view more</label>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeToAction