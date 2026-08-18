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
          heading: data.heading || 'Professional SEO Expert In Pakistan',
          subheading: data.subheading || 'Farhan Ali is an Experienced and Certified Professional SEO Expert in Pakistan with specialized Expertise in GEO / AEO / AI Search Engine Optimization and Local SEO.',
          description: data.description || 'Over the Past 5 Years, I\'ve Completed 150+ Projects, Collaborating with Top Global IT & Digital Marketing Companies and International Clients, Consistently Delivering Proven Results in Online Visibility, Organic Traffic, and Online Business Growth.',
          marqueeText: data.marquee_text || 'Professional SEO Expert In Pakistan * Farhan Ali * Professional SEO Expert In Pakistan',
          videoLink: data.video_link || '',
          showStats: data.show_stats !== false,
          stats: data.stats || [],
          showContactForm: data.show_contact_form !== false,
          primaryBtn: {
            text: data.cta_primary_text || 'Get Started',
            link: data.cta_primary_link || '/contact'
          },
          secondaryBtn: {
            text: data.cta_secondary_text || 'Learn More',
            link: data.cta_secondary_link || '#'
          }
        })
      }
    } catch (error) {
      console.error('Error loading hero:', error)
      // Set default data if fetch fails
      setHeroData({
        heading: 'Professional SEO Expert In Pakistan',
        subheading: 'Farhan Ali is an Experienced and Certified Professional SEO Expert in Pakistan with specialized Expertise in GEO / AEO / AI Search Engine Optimization and Local SEO.',
        description: 'Over the Past 5 Years, I\'ve Completed 150+ Projects, Collaborating with Top Global IT & Digital Marketing Companies and International Clients, Consistently Delivering Proven Results in Online Visibility, Organic Traffic, and Online Business Growth.',
        marqueeText: 'Professional SEO Expert In Pakistan * Farhan Ali * Professional SEO Expert In Pakistan',
        primaryBtn: { text: 'Get Started', link: '/contact' },
        secondaryBtn: { text: 'Learn More', link: '#' },
        showStats: true,
        showContactForm: true
      })
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