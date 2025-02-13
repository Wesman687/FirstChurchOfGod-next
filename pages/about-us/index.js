
import Layout from '@/components/Layout'
import React from 'react'
import pdf from '@/images/uploaded/pdf.jpg'
import Image from 'next/image'

function About() {
    return (
        <Layout>
            <div className="">
                 <h1 className="about-header">About First Church of God</h1>
                <div className='about-header-wrapper'>
                </div>
                </div>
            <div className="content_wrap">                  
                     
                
            </div>
            <Image src={pdf} alt="pdf" className="pdf" />
   
        </Layout>
    )
}

export default About