
import Layout from '@/components/Layout'
import React from 'react'
import Image from 'next/image'
import about1 from '@/images/about1.jpg'
import about2 from '@/images/about2.jpg'

function About() {
    return (
        <Layout>
            <div className="about-header-container">
                <div className='about-header-wrapper'>
                    <Image src={about1} alt="About Header" className="about-header-image" />
                </div>
                <div className='about-header-text'>
                    <h4 className='about-header-text-paragraph'>Small Church, Growing Impact: Congregation Perseveres in Palatka</h4>
                    <h5>Though the city of Palatka is relatively small, just surpassing the 10,000-person mark, the metro area of the Putnam County, Florida, community is significantly larger. Though the relatively small local Church of God congregation doesn’t regularly crest the 20-person mark, the community and kingdom impact of First Church of God is much greater than size might suggest. That’s because, even between senior pastors, they’re committed to a God whose power at work through his people can never be overstated.</h5>
                    <h5>When you don’t have a lot of people, the Holy Spirit empowers you to persevere; after all, you’ve got a divine calling—there’s much work to do in Jesus’ name. First Church of God of Palatka, Florida, knows this. They also live it out. Regardless of the perceived appeal of limiting ministry activity to a simple song-set and sermon on Sunday mornings, the things they do to worship, fellowship, and reach out with the love of Jesus astound, and resemble a church of dozens, if not hundreds, more.</h5>
                    <h5>In the past year alone, the church held a “Children’s Sunday afternoon Christian Arts program,” embarked on a mission trip to St. Charles Church of God in Trinidad, hosted a women’s mini retreat and monthly ministry, offered a five-day revival, and planned a series of summertime Christian movies, comedies, games and cookouts. Though limited in resources, First Church of God of Palatka has also been known for finding creative and effective ways to minister to children.</h5>
                </div>
                <div className='about-middle-image-container'>
                    <Image src={about2} alt="About Header" className="about-middle-image" />
                    <h5>One of two very recent baptisms!</h5>
                </div>
                <div>
                    <h5>Susan Miracle is one of several who work hard to help facilitate ministry at First Church of God. She explains that they’ve been blessed with a great interim pastor, Travis Belcher. Since October, he’s been consistently sharing Spirit-filled sermons and oversight. By mid-November, the church had celebrated two conversions to Christ and had scheduled baptism celebrations for early December.</h5>
                    <h5>The persevering, potent ministry of this Palatka church demonstrates the resolve of a church not only to carry out their unwavering commitment to Christ and community regardless of size, but also through a season of waiting. First Church of God of Palatka, Florida, proves that God’s grace and calling are sufficient to the task.</h5>

                </div>

            </div>

        </Layout>
    )
}

export default About
