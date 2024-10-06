import Layout from '@/components/Layout'
import MyPrayerRequest from '@/components/members/MyPrayerRequest'
import DisplayCompact from '@/components/prayer-request/DisplayCompact'
import ListPrayerRequest from '@/components/prayer-request/ListPrayerRequest'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function PrayerRequest() {
    const [displayCompact, setDisplayCompact] = useState(false)
    const [displayList, setDisplayList] = useState(true)
    const [displayAdmin, setDisplayAdmin] = useState(false)
    const [displayPost, setDisplayPost] = useState(false)
    const user = useSelector(state => state.user)
    
    function enableAndDisable(page) {
        setDisplayList(page === 'List' ? true : false)
        setDisplayAdmin(page === 'Admin' ? true : false)
        setDisplayCompact(page === 'Compact' ? true : false)
        setDisplayPost(page === 'Post' ? true : false)
    }
    return (
        <Layout>
            <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
                <div className="top_panel_title_inner top_panel_inner_style_3 about-us-header">
                    <div className="content_wrap">
                        <h1 className="page_title about-header">Members Area</h1>
                    </div>
                </div>
            </div>
            <div className='manage-buttons-container members-toolbar'>
                <div>
                    {!displayList ? <label className='manage-filters-label' onClick={()=> enableAndDisable('List')}>Full List</label> :
                        <label className='manage-filters-label-active manage-members-active'>Full List</label>
                    }
                    {!displayCompact ? <label className='manage-filters-label' onClick={()=> enableAndDisable('Compact')}>Compact List</label> :
                        <label className='manage-filters-label-active manage-members-active'>Compact List</label>
                    }
                    
                    {!displayPost ? <label className='manage-filters-label' onClick={()=> enableAndDisable('Post')}>Post a Request</label> :
                        <label className='manage-filters-label-active manage-members-active'>Post a Request</label>
                    }
                    {user.isAdmin && (
                        !displayAdmin ? (
                            <label className='manage-filters-label' onClick={()=> enableAndDisable('Admin')}>
                                Post As Church
                            </label>
                        ) : (
                            <label className='manage-filters-label-active manage-members-active'>
                                Post As Church
                            </label>
                        )
                    )}


                </div>
            </div>
            <div className='request-page-container'>
                {displayList && <ListPrayerRequest action={'list'} />}
                {displayCompact && <DisplayCompact />}
                {displayAdmin && <><MyPrayerRequest action={'church'} /></>}
                {displayPost && <MyPrayerRequest action={'self'} />}
            </div>
        </Layout>
    )
}

export default PrayerRequest