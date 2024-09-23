import Image from 'next/image'
import React from 'react'
import Image1 from '@/images/guitarhero.jpg'

function HomeToAction() {
    return (
        <div class="hp1_call_to_action_section">
            <div class="sc_call_to_action sc_call_to_action_style_1 sc_call_to_action_align_left sc_call_to_action_color_style_1 width_100_per">
                <div class="content_wrap">
                    <div class="columns_wrap">
                        <div class="sc_call_to_action_featured column-1_2">
                            <Image alt="" src={Image1} />
                        </div><div class="sc_call_to_action_info column-1_2">
                            <h6 class="sc_call_to_action_subtitle sc_item_subtitle">Lyrics, Chords & Translations</h6>
                            <h2 class="sc_call_to_action_title sc_item_title">Worship Team Resources</h2>
                            <div class="sc_call_to_action_descr sc_item_descr">We’re passionate about Jesus and leading others to worship Him! We hope these resources help equip you and your team as you lead worship.</div>
                            <div class="sc_call_to_action_buttons sc_item_buttons">
                                <div class="sc_call_to_action_button sc_item_button">
                                    <a href="#" class="sc_button sc_button_square sc_button_style_filled sc_button_color_style_2 sc_button_size_large orange-btn">view more</a>
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