import React from 'react'
import Testimonials from '../../Sections/Testimonials/Testimonials'
import Choose from '../../Sections/Choose/Choose'
import SeoFaqs from '../Seo/SeoFaqs'
import SeoContact from '../Seo/SeoContact'
import LocalHero from './LocalHero'
import LocalScope from './LocalScope'
import LocalPricing from './LocalPricing'

const Local = ({ serviceData }) => {
  const scopeCards = serviceData?.scopeCards
  const businessFeatures = serviceData?.businessFeatures
  const serviceId = serviceData?.id
  const heroData = serviceData

  return (
    <>
    <LocalHero heroData={heroData} businessFeatures={businessFeatures} serviceId={serviceId} />
    <LocalScope scopeCards={scopeCards} serviceId={serviceId} />
    <LocalPricing/>
    <Testimonials/>
    <Choose/>
    <SeoFaqs/>
    <SeoContact/>
    </>
  )
}

export default Local