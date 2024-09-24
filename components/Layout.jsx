import React from 'react'
import Nav from './Nav'
import Footer from './Footer'

function Layout({children}) {
  return (
    <>
    <Nav />
      <div className="home page body_style_wide body_filled article_style_stretch scheme_original top_panel_show top_panel_above sidebar_hide">
        <div className="body_wrap">
          <div className="page_wrap">
            {children}
          </div>
        </div>
      </div>
      <Footer />
      </>
  )
}

export default Layout