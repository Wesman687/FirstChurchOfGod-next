import Layout from '@/components/Layout'
import HomeComment from '@/components/members/HomeComment'
import ManageMembers from '@/components/members/ManageMembers'
import MyPrayerRequest from '@/components/members/MyPrayerRequest'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Members() {
    const user = useSelector(state => state.user)
    const [testimonial, setTestimonial] = useState(true)
    const [manageMembers, setManageMembers] = useState(false)
    const [prayerRequest, setPrayerRequest] = useState(false)    
    function handleManageTestimonials(){
        setTestimonial(true)
        setManageMembers(false)
        setPrayerRequest(false)
    }
    function handleManageMembers(){
        setTestimonial(false)
        setManageMembers(true)
        setPrayerRequest(false)
    }
    function handlePrayerRequest(){
        setPrayerRequest(true)
        setTestimonial(false)
        setManageMembers(false)
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
                    {!testimonial ? <label className='manage-filters-label' onClick={handleManageTestimonials}>Testimonial</label> :
                        <label className='manage-filters-label-active manage-members-active'>Testimonial</label>
                    }
                    {!manageMembers ? <label className='manage-filters-label' onClick={handleManageMembers}>{user.isAdmin ? 'Manage Members' : 'Show Members'}</label> :
                        <label className='manage-filters-label-active manage-members-active'>{user.isAdmin ? 'Manage Members' : 'Show Members'}</label>
                    }
                    {!prayerRequest ? <label className='manage-filters-label' onClick={handlePrayerRequest}>My Prayer Request</label> :
                        <label className='manage-filters-label-active manage-members-active'>My Prayer Request</label>
                    }
                </div>
            </div>
            {testimonial && <HomeComment />}
            {manageMembers && <ManageMembers />}
            {prayerRequest && <MyPrayerRequest />}
        </Layout>
    )
}

export default Members