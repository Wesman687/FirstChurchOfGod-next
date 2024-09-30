import Layout from '@/components/Layout'
import HomeComment from '@/components/members/HomeComment'
import ManageMembers from '@/components/members/ManageMembers'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Members() {
    const user = useSelector(state => state.user)
    const [testimonial, setTestimonial] = useState(true)
    const [manageMembers, setManageMembers] = useState(false)    
    function handleManageTestimonials(){
        setTestimonial(true)
        setManageMembers(false)
    }
    function handleManageMembers(){
        setTestimonial(false)
        setManageMembers(true)
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
                    {!manageMembers ? <label className='manage-filters-label' onClick={handleManageMembers}>Manage Members</label> :
                        <label className='manage-filters-label-active manage-members-active'>Manage Members</label>
                    }
                </div>
            </div>
            {testimonial && <HomeComment />}
            {manageMembers && <ManageMembers />}
        </Layout>
    )
}

export default Members