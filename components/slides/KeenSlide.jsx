import React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Image from 'next/image'
import slide1 from '@/images/slider1-3.jpg'
import slide2 from '@/images/slider1-2.jpg'
import slide3 from '@/images/home1_sl2.jpg'
import slide4 from '@/images/slider1_1.jpg'
import miniSlide1 from '@/images/slider1-2_layer.webp'
import miniSlide2 from '@/images/slider1-1_layer.webp'
import { Bounce, Fade, Roll } from "react-awesome-reveal"

export default function KeenSlide() {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
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
          }, 2000)
        }
        console.log(slider)
        function animateStart(){
            sliderRef.classList += ' animate-slide'
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
    ]    
  )  

  return (
    <>
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide number-slide1"><Fade><Image src={slide1} alt="" /></Fade></div>
        <div className="keen-slider__slide number-slide2"><Fade><Image src={slide2} alt="" /></Fade></div>
        <div className="keen-slider__slide number-slide3"><Fade><Image src={slide3} alt="" /></Fade></div>
        <div className="keen-slider__slide number-slide4"><Fade><Image src={slide4} alt="" /></Fade></div>
      </div>      
    </>
  )
}
