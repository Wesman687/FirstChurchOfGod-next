import Image from 'next/image'
import React, { useState } from 'react'
import slide1 from '@/images/about-slide1.jpg'
import slide2 from '@/images/about-slide2.jpg'
import slide3 from '@/images/about-slide3.jpg'
import { useKeenSlider } from 'keen-slider/react'

const content = [{
    image: slide1,
    title: 'About Our Mission',
    comment: `We are committed to being and making disciples. Disciples are people who are so in love with Jesus, they have decided that the most important...`
}, {
    image: slide2,
    title: 'What We Believe',
    comment: `Be completely humble and gentle; be patient, bearing with one another in love. Make every effort to keep the unity of the Spirit through the bond of Jesus Christ...`
}, {
    image: slide3,
    title: 'Who We Are',
    comment: `We are committed to being and making disciples. Disciples are people who are excited about the word and want to share it with others.`
}

]

function AboutSlider() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel)
        },
        loop: true,
        slides: {
            perView: 2,
          },
        created() {
            setLoaded(true)
        },
    }, [
        (slider) => {
            let timeout
            let mouseOver = false
            function clearNextTimeout() {
                clearTimeout(timeout)
            }
            function nextTimeout() {
                clearTimeout(timeout)
                if (mouseOver) return
                timeout = setTimeout(() => {
                    slider.next()
                }, 8000)
            }
            slider.on("created", () => {
                slider.container.addEventListener("mouseover", () => {
                    mouseOver = true
                    clearNextTimeout()
                })
                slider.container.addEventListener("mouseout", () => {
                    mouseOver = false
                    nextTimeout()
                })
                nextTimeout()
            })
            slider.on("dragStarted", clearNextTimeout)
            slider.on("animationEnded", nextTimeout)
            slider.on("updated", nextTimeout)
        },
    ])


    return (
        <div className="about-slide-row">
        <div ref={sliderRef} className="about-slider-container keen-slider">
                {content.map((item, index) => (                   
                     <>
                        <div key={index} className={`keen-slider__slide about-keen number-slide${content.length + 1}`}>
                            <div className="about-slider-wrapper">
                            <div className="sc_services_item_featured post_featured">
                                <div className="about-slider-image" data-title="About Our Mission">
                                    <Image alt="" className='about-slider-image' src={item.image} />
                                </div>
                            </div>
                            <div className="sc_services_item_content about-slide-desc-wrapper">
                                <h4 className="sc_services_item_title">
                                    <li>{item.title}</li>
                                </h4>
                                <div className="sc_services_item_description">
                                    <p>{item.comment}</p>
                                </div>
                                </div>
                            </div>
                        </div>
                    </>
                ))}
        </div>
        </div>
    )
}

export default AboutSlider