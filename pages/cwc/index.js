import Layout from '@/components/Layout'
import Link from 'next/link'
import React from 'react'

function CWC() {
  return (
    <Layout>
        <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
            <div className="top_panel_title_inner top_panel_inner_style_3 cwc-header">                
            </div>
        </div>
        <div className='cwc-container'>
            <div className='cwc-wrapper'>
                <h1>Discover a global network of women ready to live out their calling.</h1>
                <button className='cwc-member-button light-blue-button'>Become a member</button>
                <p>As a Christian Women Connection Member, you are grafted into the blessing of leadership training, spiritual growth, and fellowship.</p>
            </div>
        </div>
        </Layout>
  )
}

export default CWC