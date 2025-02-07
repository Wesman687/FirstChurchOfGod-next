import Image from 'next/image'
import React from 'react'
import cwc from '@/images/cwc/CWC-Mission-Slides-1.jpg'
import Link from 'next/link'

function HomeToAction() {
    return (
        <div className="home-action-container">
            <div className="columns_wrap">
                <div className="cwc-homepage-image-wrapper">
                <Link className='home-cwc-buttons-wrapper' href={'/cwc'}>
                    <Image src={cwc} className='cwc-homepage-image' alt="" />
                    </Link>
                    
                </div>
                <div className="home-cwc-wrapper">
                    <h2 className="home-cwc-title">Christian Women Connection</h2>
                    <div className="home-cwc-paragraph">Discover a global network of women ready to live out their calling.</div>
                </div>

            </div>
        </div>
    )
}

export default HomeToAction