import React from 'react'
import CampRegistration from '@/components/members/CampRegistration'
import Layout from '@/components/Layout'
function index() {
  return (
    <Layout>
      <div style={{ minHeight: "70vh", padding: '20px' }}>
        <h1>Camp Registration</h1>
    <CampRegistration />
        </div>
    </Layout>
  )
}

export default index