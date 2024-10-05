import Layout from '@/components/Layout'
import MyPrayerRequest from '@/components/members/MyPrayerRequest'
import DisplayWeekly from '@/components/prayer-request/DisplayWeekly'
import InputPrayerRequest from '@/components/prayer-request/InputPrayerRequest'
import ListPrayerRequest from '@/components/prayer-request/ListPrayerRequest'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function PrayerRequest() {
    const [displayWeekly, setDisplayWeekly] = useState(false)
    const [displayList, setDisplayList] = useState(true)
    const [displayAdmin, setDisplayAdmin] = useState(false)
    const user = useSelector(state => state.user)
    function handleManageWeekly() {
        enableAndDisable('Weekly')
    }
    function handleManageDisplayList() {
        enableAndDisable('List')
    }
    function handleAdmin() {
        enableAndDisable('Admin')
    }
    function enableAndDisable(page) {
        setDisplayList(page === 'List' ? true : false)
        setDisplayAdmin(page === 'Admin' ? true : false)
        setDisplayWeekly(page === 'Weekly' ? true : false)
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
                    {!displayList ? <label className='manage-filters-label' onClick={handleManageDisplayList}>Full List</label> :
                        <label className='manage-filters-label-active manage-members-active'>Full List</label>
                    }
                    {!displayWeekly ? <label className='manage-filters-label' onClick={handleManageWeekly}>Compact List</label> :
                        <label className='manage-filters-label-active manage-members-active'>Compact List</label>
                    }
                    {user.isAdmin && (
                        !displayAdmin ? (
                            <label className='manage-filters-label' onClick={handleAdmin}>
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
                {displayWeekly && <DisplayWeekly />}
                {displayAdmin && <><MyPrayerRequest action={'church'} /></>}
            </div>
        </Layout>
    )
}

export default PrayerRequest