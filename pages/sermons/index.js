
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
                        <source src="https://egxh7vl5cuacnn7o.public.blob.vercel-storage.com/975f47e4-9206-4251-8de2-c87271f75906/deb2-9-25-twjHOOzCGc8HKrByfcm4ikiSuuKibD.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <h5>The video features a heartfelt speech by Deb Gornoski, who shares her journey of stepping out of her comfort zone to engage in a strip club ministry. She emphasizes the importance of leaving one's comfort zone to reach out to those who are often marginalized or overlooked, drawing inspiration from Jesus' example of associating with sinners. Deb recounts her initial reluctance and the challenges she faced, but highlights the rewarding experiences and spiritual growth that came from her willingness to serve in unexpected places. She encourages others to find their own ways to spread the word of God, whether through direct outreach or supporting missions, and stresses the significance of the Great Commission. Deb also shares alarming statistics about the lack of evangelism among Christians and urges her audience to be proactive in sharing their faith. She concludes by challenging everyone to consider their comfort zones and find ways to actively participate in spreading hope and love, reminding them that even small actions can have a significant impact.</h5>
                </div>

            </div>

        </Layout>
    )
}

export default About
