import ManageFilters from '@/components/gallery/ManageFilters'
import ArrowUturnLeft from '@/components/icons/ArrowUturnLeftIcon'
import Layout from '@/components/Layout'
import AccountInfo from '@/components/modals/AccountInfo'
import Login from '@/components/modals/Login'
import { auth } from '@/firebase'
import { signOutUser } from '@/redux/userSlice'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const imageArray = [{
    image: 'http://placehold.it/2400x1600',
    category: 'EVENTS'
}, {
    image: 'https://newlife-church-html.axiomthemes.com/images/gallery-post-4.jpg',
    category: 'EVENTS'
}, {
    image: 'https://newlife-church-html.axiomthemes.com/images/participate-with-us.jpg',
    category: 'WORSHIP'
}, {
    image: 'https://newlife-church-html.axiomthemes.com/images/our-community.jpg',
    category: 'WORSHIP'
}
]
const filters = ['ALL', 'EVENTS', 'WORSHIP']

function Gallery() {
    const [filter, setFilter] = useState('ALL')
    const [displayedImages, setDisplayedImages] = useState(imageArray || [])
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [displayGallery, setDisplayGallery] = useState(true)
    const [displayFilters, setDisplayFilters] = useState('')
    async function logOut(){
        await signOut(auth)
        dispatch(signOutUser())
    }
    function handleFilter(e) {
        const value = e.target.value
        setFilter(value)
        if (value === 'ALL') {
            setDisplayedImages(imageArray)
        }
        else {
            setDisplayedImages(imageArray.filter((item) => item.category === value))
        }
    }
    function handleManageFilters(){
        if (user.isAdmin){
            setDisplayGallery(false)
            setDisplayFilters(true)
        }
        
    }
    function goBack(){
        setDisplayGallery(true)
        setDisplayFilters(false)
    }

    return (
        <>
            <Layout>
                <div className="top_panel_title top_panel_style_3 title_present breadcrumbs_present scheme_original">
                    <div className="top_panel_title_inner top_panel_inner_style_3 gallery-header breadcrumbs_block_bg3">
                        <div className="content_wrap">
                            <h1 className="page_title">Gallery</h1>
                            <div className="breadcrumbs">
                                <Link href={'/'}><li className="breadcrumbs_item home about-header" href="index.html">Home</li></Link>
                                <span className="breadcrumbs_delimiter about-header"></span>
                                <span className="breadcrumbs_item menu-item current-link about-header light-blue">Gallery</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page_content_wrap page_paddings_no">
                    <div className="content_wrap">
                        <div className="content">
                            <article className="post_item post_item_single page">
                                <section className="post_content tpl_gallery_section">
                                    <article className="myportfolio-container gallery" id="esg-grid-2-1-wrap">

                                        <div id="esg-grid-2-1" className="esg-grid">
                                            <article className="esg-filters esg-singlefilters grid-filters margin_bottom_20">
                                                <div className="esg-filter-wrapper esg-fgc-2 margin_right_3 margin_left_3">
                                                    <div className='manage-filter-container'>
                                                    <select onChange={(e) => handleFilter(e)} value={filter} className='gallery-filter-box'>
                                                        <option value='ALL'>All</option>
                                                        <option value='EVENTS'>EVENTS</option>
                                                        <option value='WORSHIP'>WORSHIP</option>
                                                    </select>
                                                    <div className='manage-filter-arrow-container'>
                                                        <div>
                                                    {user.isAdmin && <label className='manage-filters-label' onClick={handleManageFilters}>Manage Filters</label>}
                                                    </div>
                                                    
                                                    {displayFilters && 
                                                    <>                                                    
                                                    <div className='gallery-back-arrow' onClick={goBack}>
                                                        <ArrowUturnLeft />
                                                    </div>
                                                    </>}
                                                    </div>
                                                    
                                                    </div>
                                                    

                                                    <div className="nav_link admin">
                                                        {user.firstName ? (
                                                            <img src={user.photoUrl} className='displayed-photourl' />
                                                        ) : ( <Login />)}
                                                        {user.email && (
                                                            <div className="admin_dropdown ">
                                                                <>                                                                    
                                                                    <AccountInfo />
                                                                    <p className="sb__link " onClick={() => logOut()}>
                                                                        Log Out
                                                                    </p>
                                                                </>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                            <div className='gallery-image-container'>
                                                {(imageArray.length > 0 && displayGallery) && displayedImages.map((item, index) => (
                                                    <div className="esg-media-cover-wrapper" key={index}>
                                                        <div className="esg-entry-media">
                                                            <img src={item.image} alt="" />
                                                        </div>
                                                    </div>
                                                ))}
                                                {displayFilters && <ManageFilters />}
                                            </div>
                                        </div>
                                    </article>

                                </section>
                            </article>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Gallery