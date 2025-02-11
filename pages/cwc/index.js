import Layout from '@/components/Layout'
import React from 'react'
import bibleStudy from '@/images/cwc/bible-study.jpg'
import Image from 'next/image'
import bgimage from '@/images/cwc/christian-womens-connection.jpg'
import Link from 'next/link'

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
                        <h2>Discover a global network of women ready to live out their calling.</h2>
                        <h5>As a Christian Women Connection Member, you are grafted into the blessing of leadership training, spiritual growth, and fellowship.</h5>
                        <Link href={'https://christianwomenconnection.org/connection/'} target='_blank'><button className='cwc-member-button light-blue-button'>Become a member</button></Link>
                    </div>                   
                </div>
                <h5 className='cwc-body-text'>You do not have to be a member of the Church of God to join or participate in. The local chapter meet on the 4th Monday of each month at 1:00 pm. If you are interested in joining and/or visiting our group and have any question, please call Susan at <a href='tel:#3865460143' className='light-blue'>386-546-0143</a> 
                </h5>
                <div className='cwc-mission-container'>
                    <div className='cwc-mission-wrapper' >
                    <h3>Our Mission</h3>
                    <ul>
                    <li>When you improve the lives of women, you change the world.</li>
                    <li>We exist to build relationships with women everywhere. </li>
                    <li>We provide ministry resources to the Church of God and to other groups to connect women through relationships, spiritual formation, and service.</li>
                    <li>We support others as they train and empower women for leadership in peace building and reconciliation.</li>
                    </ul>
                    </div>
                    <Link href={'https://christianwomenconnection.org/connection/'} target='_blank'><button className='cwc-visit-button orange-btn click'>Visit Us</button></Link>
                </div>
            </div>
        </Layout>
    )
}

export default CWC