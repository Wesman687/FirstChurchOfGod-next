import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import blank from '@/images/56x56.png'
import TestimonialSlide from '../slides/TestimonialSlide'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '@/firebase'
import RingSpinner from '../RingSpinner'
const data = [{
    comment: 'I have two great passions: one is to build the Church of Jesus Christ and the other is to lift the lives of people and help them fulfil their potential in life',
    image: blank.src,
    user: 'Bruce Siegar',
    position: 'Pastor'
}, {
    comment: 'I have been going to this church my whole life and it is such a blessing to me! I am so blessed to be able to attend Grace and be a part of the amazing things that God is doing.',
    image: blank.src,
    user: 'Herbert Wright',
    position: 'Executive Pastor'
}, {
    comment: 'Me and my husband have found our relationship with this team to be a very satisfying and mutually beneficial experience.',
    image: blank.src,
    user: 'Elmer Black',
    position: 'Lead Teacher'
},
]

function Testimonial() {
    const [loading, setLoading] = useState(false)
    const [testimonials, setTestimonials] = useState([])
    console.log(testimonials)
    useEffect(()=>{
        setLoading(true)
        const q = query(collection(db, 'testimonial'))        
        const unsubscribe = onSnapshot(q, (snapshot) =>{
            const data = snapshot.docs
            setTestimonials(data.map((item)=> item.data()))
        })
        setLoading(false)
        return unsubscribe
    },[])
    return (
        <div className="hp1_testimonials_section">
            <div className="content_wrap">
                        {loading ? 
                        <div className='settings-ring-container'><RingSpinner /></div>                      
                        
                        : <><div className="sc_testimonial_item">
                            {testimonials.length > 0 && <TestimonialSlide slides={testimonials} />}
                        </div>

                <div className="sc_slider_controls_wrap">
                    <a className="sc_slider_prev" href="#"></a>
                    <a className="sc_slider_next" href="#"></a>
                </div></>}
            </div>
        </div>
    )
}

export default Testimonial