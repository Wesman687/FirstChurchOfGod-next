import Image from 'next/image'
import React, { useRef } from 'react'
import slide1 from '@/images/slider1-3.jpg'
import slide2 from '@/images/slider1-2.jpg'
import slide3 from '@/images/home1_sl2.jpg'
import miniSlide2 from '@/images/slider1-1_layer.webp'
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import { Fade, Roll, Slide } from 'react-awesome-reveal'

const content = [
  {
    title: "Welcome to First Church of God",
    description:
      "First Church of God is a church that believes in Jesus, a church that loves God and people. Loving God, Loving People & Serving the Lord. ",
    button: "Visit Us",
    image: slide1.src,
  },
  {
    title: "",
    description:
      "",
    image: slide2.src,
    user: "Erich Behrens",
    userProfile: miniSlide2
  },
  {
    title: "Wednesday Studies",
    description:
      "Come join us on Wednesday's for movies, games and other fun wholesome activites",
    image: slide3.src,
    button: "Visit Us",
  }
];

export default function CustomSlider() {
    return (
  <>    
  
  <div className='slider-container'>     
    <Slider className="slider-wrapper" infinite={true} autoplay={5000} nextButton previousButton>
      {content.map((item, index) => (
        
        <div
          key={index}
          
          className="slider-content"
          style={{ background: `url('${item.image}') no-repeat center` }}
        >
          <div className="inner">
            <Slide direction='down'>
            <Fade cascade>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            </Fade>
            </Slide>
            {item.button && <button className='slide-button design-button'>{item.button}</button>}
            
          </div>
          <section>
            <Image className='slider-mini-image' src={item.userProfile} alt={item.user} />           
          </section>
          <div className='shine'></div>
          
        
        </div>       
        
      ))}
      
    </Slider>
    
    </div>
  </>
);
}
