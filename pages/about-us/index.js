
import Layout from '@/components/Layout'
import React from 'react'
import pdf from '@/images/uploaded/pdf.jpg'
import Image from 'next/image'

function About() {
    return (
        <Layout>
            <div className="about-header-container">
                <div className='about-header-wrapper'>
                <Image src={pdf} alt="pdf" className="pdf" />
                </div>
                </div>
   
        </Layout>
    )
}

export default About