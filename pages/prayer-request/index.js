import Layout from '@/components/Layout'
import DisplayWeekly from '@/components/prayer-request/DisplayWeekly'
import ListPrayerRequest from '@/components/prayer-request/ListPrayerRequest'
import React, { useState } from 'react'

function PrayerRequest() {
    const [displayWeekly, setDisplayWeekly] = useState(false)
    const [displayList, setDisplayList] = useState(true)
    function handleManageWeekly() {
        setDisplayWeekly(true)
        setDisplayList(false)
    }
    function handleManageDisplayList(){
        setDisplayList(true)
        setDisplayWeekly(false)
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
                    {!displayList ? <label className='manage-filters-label' onClick={handleManageDisplayList}>Prayer Request by </label> :
                        <label className='manage-filters-label-active manage-members-active'>Full List</label>
                    }
                    {!displayWeekly ? <label className='manage-filters-label' onClick={handleManageWeekly}>Compact List</label> :
                        <label className='manage-filters-label-active manage-members-active'>Compact List</label>
                    }
                    
                </div>
            </div>
            <div className='request-page-container'>
               {displayList && <ListPrayerRequest action={'list'} />}
               {displayWeekly && <DisplayWeekly />}
            </div>
        </Layout>
  )
}

export default PrayerRequest