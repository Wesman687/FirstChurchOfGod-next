import Layout from '@/components/Layout'
import CalendarList from '@/components/programs/CalendarList'
import WeeklyEventsManager from '@/components/programs/WeeklyEventsManager'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function CalendarPage() {
  const [showWeeklyManager, setShowWeeklyManager] = useState(false);
  const user = useSelector(state => state.user);

  return (
    <Layout>
        
        <>
        <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
            <div className="top_panel_title_inner top_panel_inner_style_3 about-us-header">
            <div className="content_wrap">
                    <h1 className="page_title about-header">Calendar</h1>
                    {user.isAdmin && (
                      <button 
                        onClick={() => setShowWeeklyManager(!showWeeklyManager)}
                        className="weekly-manager-toggle-btn"
                        style={{
                          marginLeft: '20px',
                          padding: '10px 15px',
                          backgroundColor: showWeeklyManager ? '#FF9800' : '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        {showWeeklyManager ? 'Hide Weekly Events Manager' : 'Manage Weekly Events'}
                      </button>
                    )}
                </div>
            </div>
        </div>
        
        {user.isAdmin && showWeeklyManager && (
          <div style={{ margin: '20px 0' }}>
            <WeeklyEventsManager />
          </div>
        )}
        
        <div className='calendar-container'>
        <CalendarList />
        </div></>
        </Layout>
  )
}

export default CalendarPage