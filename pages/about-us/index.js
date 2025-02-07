import TeamSection from '@/components/about/TeamSection'
import Layout from '@/components/Layout'
import banner from '@/images/cross-in-sky.png'
import React from 'react'
import pdf from '@/images/uploaded/pdf.jpg'
import Image from 'next/image'

function About() {
    return (
        <Layout>
            <div className="about-us-header">
                <Image className='about-us-banner-image' src={banner} alt="banner" />
                <div className='about-header-wrapper'>
                 <h1 className="about-header">About First Church of God</h1>
                </div>
                </div>
            <div className="content_wrap">
                    
                     
                
            </div>
            <Image src={pdf} alt="pdf" className="pdf" />
   
        </Layout>
    )
}

export default About