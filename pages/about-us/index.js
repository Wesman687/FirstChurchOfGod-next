import TeamSection from '@/components/about/TeamSection'
import Layout from '@/components/Layout'
import AboutSlider from '@/components/slides/AboutSlider'
import Link from 'next/link'
import React from 'react'

function About() {
    return (
        <Layout>
        <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
            <div className="top_panel_title_inner top_panel_inner_style_3 about-us-header">
            <div className="content_wrap">
                    <h1 className="page_title about-header">About First Church of God</h1>
                    
                </div>
            </div>
            <AboutSlider />
            <TeamSection />
        </div>
        </Layout>
    )
}

export default About