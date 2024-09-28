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
                <h5 className='cwc-body-text'>You do not have to be a member of the Church of God to join or participate in.
                        The local chapter meet on the second Thursday of each month at 10:00 am
                        If you are interested in joining and/or visiting our group and have any question, please call Susan at <a href='tel:#3865460143'>386-546-0143</a> 
                </h5>
                <div className='cwc-mission-container'>
                    <div className='cwc-mission-wrapper'>
                    <h3>Our Mission</h3>
                    <h4>When you improve the lives of women, you change the world.</h4>
                    <h4>We exist to build relationships with women everywhere. </h4>
                    <h4>We provide ministry resources to the Church of God and to other groups to connect women through relationships, spiritual formation, and service.</h4>
                    <h4>We support others as they train and empower women for leadership in peace building and reconciliation.</h4>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CWC