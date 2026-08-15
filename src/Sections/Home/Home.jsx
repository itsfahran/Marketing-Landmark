import React, { useEffect, useState } from 'react'
import Hero from "../Hero/Hero"
import Service from '../Services/Service'
import Process from '../Process/Process'
import About_Section from '../About-Section/About_Section'
import Hire from '../Hire/Hire'
import Portfolio_Section from '../Portfolio-Section/Portfolio_Section'
import Testimonials from '../Testimonials/Testimonials'
import VideoTestimonials from '../VideoTestimonials/VideoTestimonials'
import Choose from '../Choose/Choose'
import Contact_Section from '../Contact_Section/Contact_Section'
import Brand from '../Brand/Brand'
import { fetchHero } from '../../lib/supabase-queries'

const Home = () => {
  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    loadHeroData()
  }, [])

  const loadHeroData = async () => {
    try {
      const data = await fetchHero()
      if (data) {
        setHeroData({
          heading: data.heading,
          subheading: data.description,
          description: data.description,
          marqueeText: data.heading,
          primaryBtn: { text: data.cta_text || 'Get Started', link: data.cta_link || '/contact' },
        })
      }
    } catch (error) {
      console.error('Error loading hero:', error)
    }
  }

  return (
    <>
    <Hero {...heroData} />
    <Service/>
    <Process/>
    <About_Section/>
    <Hire/>
    <Portfolio_Section/>
    <Testimonials/>
    <VideoTestimonials/>
    <Brand/>
    <Choose/>
    <Contact_Section/>
    </>
  )
}

export default Home