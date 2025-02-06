
import React, { useEffect, useState } from 'react'
import TestimonialSlide from '../slides/TestimonialSlide'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { db } from '@/firebase'
import RingSpinner from '../RingSpinner'


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