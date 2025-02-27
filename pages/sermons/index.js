
import Layout from '@/components/Layout'
import React from 'react'

function About() {
    return (
        <Layout>
            <div className="sermon-container">
                <h1>Sermons</h1>
                <div className="video-container">
                    <h2>Stepping out your comfort zone</h2>
                    <video width="100%" controls>
                        <source src="https://paulwesleymiracle.nyc3.cdn.digitaloceanspaces.com/paulwesleymiracle/firstchurchofgod/deb2-9-25.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <h5>{`The video features a heartfelt speech by Deb Gornoski, who shares her journey of stepping out of her comfort zone to engage in a strip club ministry. She emphasizes the importance of leaving ones comfort zone to reach out to those who are often marginalized or overlooked, drawing inspiration from Jesus example of associating with sinners...`}</h5>
                    </div>

            </div>

        </Layout>
    )
}

export default About
