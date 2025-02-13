import Layout from '@/components/Layout'
import CalendarList from '@/components/programs/CalendarList'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function CalendarPage() {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(()=>{
        if (!user.isMember){
            toast.warning('Only Members can view this page.')
            router.push('/')
        }
    },[])
  return (
    <Layout>
        
        <>
        <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
            <div className="top_panel_title_inner top_panel_inner_style_3 about-us-header">
            <div className="content_wrap">
                    <h1 className="page_title about-header">Calendar</h1>
                    
                </div>
            </div>
        </div>
        <div className='calendar-container'>
        <CalendarList />
        </div></>
        </Layout>
  )
}

export default CalendarPage