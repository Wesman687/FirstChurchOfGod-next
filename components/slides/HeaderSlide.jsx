import Image from 'next/image'
import React from 'react'
import slide1 from '@/images/slider1-3.jpg'
import slide2 from '@/images/slider1-2.jpg'
import slide3 from '@/images/home1_sl2.jpg'
import slide4 from '@/images/slider1_1.jpg'
import miniSlide1 from '@/images/slider1-2_layer.webp'
import miniSlide2 from '@/images/slider1-1_layer.webp'
import KeenSlide from './KeenSlide'
import CustomerSlider from './CustomSlider'

function HeaderSlide() {
  return (
    <>
    <CustomerSlider />
    </>
  )
}

export default HeaderSlide