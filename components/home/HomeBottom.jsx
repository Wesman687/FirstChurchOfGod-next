import React from 'react'
import Login from '../modals/Login'

function HomeBottom() {
    return (
            <div className='home-bottom-container'>
            <div className="home-bottom-wrapper">
                <h2 className="home-bottom-firstparagraph">If you are interested in Becoming a member, Sign Up here, and we will get back with you shortly.</h2>
                <div className="home-bottom-email">
                    <h4 className="">Email Us</h4>
                    <h4 className="">
                        info@yoursite.com
                    </h4>
                </div>
                <div className="home-bottom-button "><Login defaultState={'Sign Up'} classes={"login-link-outline"}/></div>
            </div>
        </div>
    )
}

export default HomeBottom