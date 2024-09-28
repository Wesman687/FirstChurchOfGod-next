import Layout from '@/components/Layout'
import React from 'react'
import bibleStudy from '@/images/cwc/bible-study.jpg'
import Image from 'next/image'
import bgimage from '@/images/cwc/christian-womens-connection.jpg'

function CWC() {
  return (
    <Layout>
        <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
            <div className=" top_panel_inner_style_3">     
                <Image src={bgimage} alt='background image' className='cwc-bg-image' />           
            </div>
        </div>
        <div className='cwc-container'>
            <div className='cwc-wrapper'>
                <Image src={bibleStudy} className='cwc-intro-image' alt='Women studying bible' />
                <div className='cwc-intro-wrapper'>
                <h3>Discover a global network of women ready to live out their calling.</h3>
                <h5>As a Christian Women Connection Member, you are grafted into the blessing of leadership training, spiritual growth, and fellowship.</h5> 
                <button className='cwc-member-button light-blue-button'>Become a member</button>               
                </div>
                
            </div>
        </div>
        </Layout>
  )
}

export default CWC