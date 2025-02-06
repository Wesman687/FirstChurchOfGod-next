import Layout from '@/components/Layout'
import React from 'react'
import art_camp from '@/images/art_banner.jpg'
import art_camp2 from '@/images/art_camp2.jpg'
import Image from 'next/image'
import RegistrationForm from './registrationForm'

function index() {
  return (
    <Layout>
        <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
                <div className=" top_panel_inner_style_3">
                    <Image src={art_camp} alt='background image' className='cwc-bg-image' />
                </div>
            </div>
            <div className='cwc-container'>
                <div className='camp-wrapper'>
                    <div className='cwc-intro-wrapper'>
                        <h1>Beggining March 2, 2025</h1>
                        <h2 style={{color: "red"}}>Christian Art Classes</h2>
                        <h3>Sundays (1st grade - 5th grade) 1:00 - 2:30pm </h3>                        
                    </div>      
                    <div className='camp-paragraph'>
                        <h5>The program is free and donations are gladly accepted.</h5>
                        <h5>Classes are led by Professional Artist and Educator, Susan Miracle along with a team of volunteers</h5>
                        <h5>and is hosted by the First Church of God.</h5>
                        <h5>The Church is located at 2915 St. Johns Ave. Palatka</h5>
                        <h5>Class size is limited, so please reserve early!</h5>
                        <h5>386-546-0143</h5>    
                    </div>             
                </div>
                <h5 className='cwc-body-text'>2024 Winning Artist
                </h5>
                <div className='cwc-mission-container'>
                <Image src={art_camp2} className='art-camp-image' alt='Art Camp Winners' />
                    <RegistrationForm />
                </div>
            </div>
        </Layout>
  )
}

export default index