import AboutSlider from '@/components/slides/AboutSlider'
import Link from 'next/link'
import React from 'react'

function About() {
    return (
        <div class="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
            <div class="top_panel_title_inner top_panel_inner_style_3 about-us-header">
                <div class="content_wrap">
                    <h1 class="page_title about-header">About First Church of God</h1>
                    <div class="breadcrumbs">
                        <Link href={'/'}><li class="breadcrumbs_item home about-header" href="index.html">Home</li></Link>
                        <span class="breadcrumbs_delimiter about-header"></span>
                        <span class="breadcrumbs_item menu-item current-link about-header light-blue">About Us</span>
                    </div>
                </div>
            </div>
            <AboutSlider />
        </div>
    )
}

export default About