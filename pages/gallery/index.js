import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const imageArray = [{
    image: 'http://placehold.it/2400x1600',
    category: 'events'
}, {
    image: 'https://newlife-church-html.axiomthemes.com/images/gallery-post-4.jpg',
    category: 'events'
}, {
    image: 'https://newlife-church-html.axiomthemes.com/images/participate-with-us.jpg',
    category: 'worship'
}, {
    image: 'https://newlife-church-html.axiomthemes.com/images/our-community.jpg',
    category: 'worship'
}
]

function Gallery() {
    const [filter, setFilter] = useState('all')
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
                                                    <select>

                                                    </select>
                                                </div>
                                            </article>
                                            <div className='gallery-image-container'>
                                                {imageArray.length > 0 && imageArray.map((item, index) => (
                                                    <div className="esg-media-cover-wrapper" key={index}>
                                                        <div className="esg-entry-media">
                                                            <img src={item.image} alt="" />
                                                        </div>
                                                    </div>
                                                ))}
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