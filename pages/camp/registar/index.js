import React from 'react'
import CampRegistration from '@/components/members/CampRegistration'
import Layout from '@/components/Layout'
import CampHead from '@/components/CampHead'

function index() {
  return (
    <>
      <CampHead 
        title="Camp Registration Management - First Church of God Admin"
        description="Administrative portal for managing Art Camp 2025 registrations. View, edit, and organize all participant information securely."
        image="/images/art_camp2.jpg"
        url="/camp/registar"
      />
      <Layout>
        <div style={{ minHeight: "70vh", padding: '20px' }}>
          <h1>Camp Registration</h1>
          <CampRegistration />
        </div>
      </Layout>
    </>
  )
}

export default index