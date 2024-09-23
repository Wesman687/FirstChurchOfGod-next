import Image from 'next/image'
import React from 'react'
import blank from '@/images/56x56.png'
import TestimonialSlide from '../slides/TestimonialSlide'
const data = [{
    comment: 'I have two great passions: one is to build the Church of Jesus Christ and the other is to lift the lives of people and help them fulfil their potential in life',
    image: blank,
    user: 'Bruce Siegar',
    position: 'Pastor'
}, {
    comment: 'I have been going to this church my whole life and it is such a blessing to me! I am so blessed to be able to attend Grace and be a part of the amazing things that God is doing.',
    image: blank,
    user: 'Herbert Wright',
    position: 'Executive Pastor'
}, {
    comment: 'Me and my husband have found our relationship with this team to be a very satisfying and mutually beneficial experience.',
    image: blank,
    user: 'Elmer Black',
    position: 'Lead Teacher'
},
]

function Testimonial() {

    return (
        <div className="hp1_testimonials_section">
            <div className="content_wrap">
                <div className="slides swiper-wrapper">
                    <div className="swiper-slide width_100_per">
                        <div className="sc_testimonial_item">
                            <TestimonialSlide slides={data} />
                        </div>
                    </div>
                </div>

                <div className="sc_slider_controls_wrap">
                    <a className="sc_slider_prev" href="#"></a>
                    <a className="sc_slider_next" href="#"></a>
                </div>
            </div>
        </div>
    )
}

export default Testimonial