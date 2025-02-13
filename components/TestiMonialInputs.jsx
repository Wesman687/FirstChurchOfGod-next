
import React from 'react'

function TestiMonialInput({comment, image, user, position}) {
    return (
        <>
            <div className="sc_testimonial_content testimonial-comment">
                <p>{comment}</p>
            </div>
            <div className="sc_testimonial_avatar-info">
                <div>
                <img src={image} className="testimonial-image" alt="Community" />
                </div>
                

                <div className="sc_testimonial_author">
                    <h3 className="sc_testimonial_author_name">{user}</h3>
                    <h4 className="sc_testimonial_author_position">{position}</h4>
                </div>
            </div>
        </>

    )
}

export default TestiMonialInput