import React, { useEffect, useRef, useState } from "react";
import "./Seo.css";
import { FaHandPointRight } from "react-icons/fa";
import heroImg from "../../assets/hero.png";
import onPageImg from "../../assets/onPageImg.png";
import offPageImg from "../../assets/offPageImg.png";
import technicalImg from "../../assets/technicalImg.png";
import { FaCheckCircle } from "react-icons/fa";
import {
  FaFileAlt,
  FaChartLine,
  FaKey,
  FaEdit,
  FaCog,
  FaLink,
  FaMapMarkerAlt,
  FaChartPie,
  FaLongArrowAltRight,
} from "react-icons/fa";
import {
  FaWordpress,
  FaShopify,
  FaChevronLeft,
  FaChevronRight,
    FaArrowRight,
} from "react-icons/fa";
import {
  SiWix,
  SiWoo,
  SiSquarespace,
  SiSemrush,
  SiGoogleanalytics,
  SiGoogletagmanager,
  SiGoogleads,
} from "react-icons/si";
import { MdWeb, MdSearch } from "react-icons/md";
import SeoHire from "./SeoHire";
import SeoCaseStudies from "./SeoCaseStudies";
import Testimonials from "../../Sections/Testimonials/Testimonials";
import Choose from "../../Sections/Choose/Choose";
import SeoFaqs from "./SeoFaqs";
import SeoContact from "./SeoContact";
import Brand from "../../Sections/Brand/Brand";

const packages = [
  {
    name: "Basic",
    subtitle: "Best for New Startups",
    price: "59,999",
    pages: "Upto 10 Page Website SEO",
    features: [
      "Setup Google Search Console",
      "Setup Google Analytics",
      "Setup Google Tag Manager",
      "User Intent-Based Keyword Research",
      "Header Tag Optimization (H1, H2, H3)",
      "Readability Optimization",
      "FAQ's Optimization",
      "Internal Linking",
      "External Linking",
      "Image Optimization",
      "URL Optimization",
      "Meta Title Tag Optimization",
      "Meta Description Tag Optimization",
      "Analyze Off-Page SEO Profile",
      "Submit Spammy Backlinks in Google Search Console (GSC) Disavow",
      "Competitor Backlink Analysis & Replication",
      "5 Brand Promotion Listicle",
      "50 Mix General High-Quality Backlinks",
      "20 Local Citations",
      "Update XML Sitemap",
      "Optimize Robots.txt File",
      "Add LLMs.txt File",
      "Crawl Error Fixing",
    ],
  },
  {
    name: "Standard",
    subtitle: "Best for Mid Range Businesses",
    price: "99,999",
    pages: "Upto 20 Pages Website SEO",
    popular: true,
    features: [
      "Setup Google Search Console",
      "Setup Google Analytics",
      "Setup Google Tag Manager",
      "User Intent-Based Keyword Research",
      "Content Optimization",
      "Header Tag Optimization (H1, H2, H3)",
      "Readability Optimization",
      "FAQ's Optimization",
      "Internal Linking",
      "External Linking",
      "Image Optimization",
      "URL Optimization",
      "Meta Title Tag Optimization",
      "Meta Description Tag Optimization",
      "Analyze Off-Page SEO Profile",
      "Submit Spammy Backlinks in Google Search Console (GSC) Disavow",
      "Competitor Backlink Analysis & Replication",
      "10 Brand Promotion Listicle",
      "100 Mix General High-Quality Backlinks",
      "50 Local Citations",
      "Update XML Sitemap",
      "Optimize Robots.txt File",
      "Add LLMs.txt File",
      "Crawl Error Fixing",
      "Fix Broken Backlinks",
      "Activate 301/302 Redirects",
      "Mobile Responsiveness Optimization",
      "Schema Markup Implementation",
      "Google Business Profile Optimization",
    ],
  },
  {
    name: "Premium",
    subtitle: "Best for Large Businesses",
    price: "149,999",
    pages: "Upto 30 Page Website SEO",
    features: [
      "Setup Google Search Console",
      "Setup Google Analytics",
      "Setup Google Tag Manager",
      "User Intent-Based Keyword Research",
      "Content Optimization",
      "Header Tag Optimization (H1, H2, H3)",
      "Readability Optimization",
      "FAQ's Optimization",
      "Internal Linking",
      "External Linking",
      "Image Optimization",
      "URL Optimization",
      "Meta Title Tag Optimization",
      "Meta Description Tag Optimization",
      "Analyze Off-Page SEO Profile",
      "Submit Spammy Backlinks in Google Search Console (GSC) Disavow",
      "Competitor Backlink Analysis & Replication",
      "20 Brand Promotion Listicle",
      "200 Mix General High-Quality Backlinks",
      "100 Local Citations",
      "Update XML Sitemap",
      "Optimize Robots.txt File",
      "Add LLMs.txt File",
      "Crawl Error Fixing",
      "Fix Broken Backlinks",
      "Activate 301/302 Redirects",
      "Mobile Responsiveness Optimization",
      "Schema Markup Implementation",
      "Google Business Profile Optimization",
      "Improve Core Web Vitals Speed & Performance Optimization",
      "Implement Custom 404 Page",
      "AI Generative Engine Optimization",
    ],
  },
];

const processSteps = [
  {
    icon: <FaFileAlt />,
    title: "Website Audit",
    desc: "Analyze the current site to identify issues and improvement opportunities.",
  },
  {
    icon: <FaChartLine />,
    title: "Competitor Analysis",
    desc: "Understand what's working best in your niche.",
  },
  {
    icon: <FaKey />,
    title: "Keyword Research",
    desc: "Find the right keywords that attract relevant audience.",
  },
  {
    icon: <FaEdit />,
    title: "On-Page Optimization",
    desc: "Improve website elements and content to make it search-friendly and user-focused.",
  },
  {
    icon: <FaCog />,
    title: "Technical SEO",
    desc: "Fix site technical issues, improve site speed, mobile-friendliness, and crawlability.",
  },
  {
    icon: <FaLink />,
    title: "Off-Page SEO",
    desc: "Analyze off-page SEO, fix errors, and create high-quality backlink & local citations.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Local & GEO Optimization",
    desc: "Optimize GBP for local search visibility and target regional customers.",
  },
  {
    icon: <FaChartPie />,
    title: "Reporting & Growth",
    desc: "Track performance, analyze results, and scale visibility.",
  },
];

const cmsData = [
  {
    title: "Custom Site SEO",
    icon: <MdWeb />,
    className: "custom",
  },
  {
    title: "WordPress SEO",
    icon: <FaWordpress />,
    className: "wordpress",
  },
  {
    title: "Shopify SEO",
    icon: <FaShopify />,
    className: "shopify",
  },
  {
    title: "Wix SEO",
    icon: <SiWix />,
    className: "wix",
  },
  {
    title: "WooCommerce SEO",
    icon: <SiWoo />,
    className: "woo",
  },
  {
    title: "Squarespace SEO",
    icon: <SiSquarespace />,
    className: "squarespace",
  },
];

const toolsData = [
  {
    title: "GSC",
    icon: <MdSearch />,
    className: "gsc",
  },
  {
    title: "GA4",
    icon: <SiGoogleanalytics />,
    className: "ga4",
  },
  {
    title: "GTM",
    icon: <SiGoogletagmanager />,
    className: "gtm",
  },
  {
    title: "Ahrefs",
    icon: <span className="text-logo ahrefs-logo">ahrefs</span>,
    className: "ahrefs",
  },
  {
    title: "SEMRush",
    icon: <SiSemrush />,
    className: "semrush",
  },
  {
    title: "Google Ads",
    icon: <SiGoogleads />,
    className: "ads",
  },
];

const Seo = ({ serviceData }) => {
  const heroData = serviceData;
  const [experience, setExperience] = useState(0);
  const [projects, setProjects] = useState(0);
  const [clients, setClients] = useState(0);

  const processSectionRef = useRef(null);
const [isProcessVisible, setIsProcessVisible] = useState(false);
  useEffect(() => {
    const startCounter = (endValue, setter, duration = 1800) => {
      let startValue = 0;
      const incrementTime = 20;
      const totalSteps = duration / incrementTime;
      const incrementValue = endValue / totalSteps;

      const counter = setInterval(() => {
        startValue += incrementValue;

        if (startValue >= endValue) {
          setter(endValue);
          clearInterval(counter);
        } else {
          setter(Math.floor(startValue));
        }
      }, incrementTime);
    };

    startCounter(5, setExperience);
    startCounter(150, setProjects);
    startCounter(90, setClients);
  }, []);
useEffect(() => {
  const currentSection = processSectionRef.current;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsProcessVisible(entry.isIntersecting);
    },
    {
      threshold: 0.25,
    }
  );

  if (currentSection) {
    observer.observe(currentSection);
  }

  return () => {
    if (currentSection) {
      observer.unobserve(currentSection);
    }
  };
}, []);
  const repeatedTools = [...toolsData, ...toolsData];
  const repeatedProcessSteps = [...processSteps, ...processSteps];

  return (
    <>
      <section className="seo-hero-section">
        <div className="seo-hero-container">
          <div className="seo-hero-content">
            {/* <div className="seo-hero-badge">
              <FaHandPointRight />
              <span>Search Engine Optimization (SEO)</span>
            </div> */}

            <h1>
              Best SEO Services in Pakistan by
              <br />
              Professional SEO Expert
            </h1>

            <p>
              Farhan Ali is a Top-Rated SEO freelancer on Fiverr, providing SEO
              services in Pakistan with 5+ years of experience in SEO and
              expertise in GEO / AEO / AI Search Engine Optimization and Local
              SEO. Worked with top global IT and digital marketing companies and
              international clients, completing 150+ projects on freelance
              platforms.
            </p>

            <div className="seo-hero-stats">
              <div className="seo-stat-box">
                <h3>{experience}+</h3>
                <span>Years Experience</span>
              </div>

              <div className="seo-stat-box">
                <h3>{projects}+</h3>
                <span>Project Complete</span>
              </div>

              <div className="seo-stat-box">
                <h3>{clients}%</h3>
                <span>Return Clients</span>
              </div>
            </div>
          </div>

          {/* <div className="seo-hero-image">
            <img src={heroImg} alt="Professional SEO Expert" />
          </div> */}
           <div className="contact-form-box">
                              <span className="contact-small-title">Send Message</span>
                              <h2>Get In Touch</h2>
                  
                              <form className="contact-form">
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" placeholder="First Name" />
                                  </div>
                  
                                  <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" placeholder="Last Name" />
                                  </div>
                                </div>
                  
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>Services</label>
                                    <select defaultValue="Search Engine Optimization (SEO)">
                                      <option>Search Engine Optimization (SEO)</option>
                                      <option>Generative Engine Optimization</option>
                                      <option>Local SEO</option>
                                      <option>AI Search Optimization</option>
                                      <option>Web Development</option>
                                      <option>Graphic Design</option>
                                    </select>
                                  </div>
                  
                                  <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Email" />
                                  </div>
                                </div>
                  
                                <div className="form-group">
                                  <label>Message</label>
                                  <textarea placeholder="Message"></textarea>
                                </div>
                  
                                <button type="submit" className="contact-submit-btn">
                                  Submit <FaArrowRight />
                                </button>
                              </form>
                            </div>
        </div>

        <div className="seo-hero-marquee">
          <div className="seo-marquee-track">
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>Farhan Ali</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>Farhan Ali</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>Farhan Ali</span>
            <strong>*</strong>
          </div>

          <div className="seo-marquee-track">
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>Farhan Ali</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>Farhan Ali</span>
            <strong>*</strong>
            <span>Professional SEO Expert In Pakistan</span>
            <strong>*</strong>
            <span>Farhan Ali</span>
            <strong>*</strong>
          </div>
        </div>
        <div className="seo-hero-seo-intro">
          <div className="seo-intro-left">
            <h2>
              How SEO Helps Your Website Rank Higher on Google
              <span className="google-text">
                <span className="g-blue">G</span>
                <span className="g-red">o</span>
                <span className="g-yellow">o</span>
                <span className="g-blue">g</span>
                <span className="g-green">l</span>
                <span className="g-red">e</span>
              </span>
              ?
            </h2>
          </div>

          <div className="seo-intro-right">
            <p>
              Search Engine Optimization (SEO) plays a crucial role in helping
              websites rank higher on
              <span className="small-google">
                <span className="g-blue">G</span>
                <span className="g-red">o</span>
                <span className="g-yellow">o</span>
                <span className="g-blue">g</span>
                <span className="g-green">l</span>
                <span className="g-red">e</span>
              </span>
              . By optimizing content, website structure, and technical
              elements, SEO ensures that search engines understand the site and
              show it to the right audience.
            </p>
          </div>
        </div>
      </section>

      <section className="scope-section">
        <div className="scope-container">
          <div className="scope-heading">
            <span>☛ Scope</span>
            <h2>Scope Of SEO Services In Pakistan</h2>
            <p>
              Search Engine Optimization (SEO) is a complete strategy designed
              to improve your website’s visibility, traffic, and rankings on
              search engines like Google. Our SEO services in Pakistan is
              focused on three core pillars that work together to deliver
              long-term, sustainable results.
            </p>
          </div>

          <div className="scope-grid">
            <div className="scope-card">
              <div className="scope-image">
                <img src={onPageImg} alt="On Page SEO" />
              </div>

              <div className="scope-content">
                <h3>On Page SEO</h3>
                <p>
                  On-Page SEO focuses on optimizing the content and structure of
                  your website to make it search-engine friendly and
                  user-focused. We ensure every page is optimized to rank higher
                  and convert visitors into customers.
                </p>
              </div>
            </div>

            <div className="scope-card">
              <div className="scope-image">
                <img src={offPageImg} alt="Off Page SEO" />
              </div>

              <div className="scope-content">
                <h3>Off Page SEO</h3>
                <p>
                  Off-Page SEO builds your website’s authority and trust through
                  external signals and high-quality backlinks. Our goal is to
                  increase your domain authority and establish your website as a
                  trusted source in your industry.
                </p>
              </div>
            </div>

            <div className="scope-card">
              <div className="scope-image">
                <img src={technicalImg} alt="Technical SEO" />
              </div>

              <div className="scope-content">
                <h3>Technical SEO</h3>
                <p>
                  Technical SEO ensures your website is fast, secure, and easy
                  for search engines to crawl and index. We optimize the
                  technical foundation of your website to improve user
                  experience, site speed, and rankings on Search Engines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="seo-pricing-section">
        <div className="seo-pricing-container">
          <div className="seo-pricing-heading">
            <span className="pricing-label">Pricing</span>
            <h2>SEO Packages In Pakistan</h2>
            <p>
              Choose a powerful SEO plan designed to improve visibility,
              rankings, technical performance and long-term organic growth.
            </p>
          </div>

          <div className="seo-pricing-grid">
            {packages.map((pkg, index) => (
              <div
                className={`seo-price-card ${pkg.popular ? "popular-card" : ""}`}
                key={index}
              >
                {pkg.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}

                <div className="seo-card-top">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.subtitle}</p>
                </div>

                <div className="seo-price-box">
                  <span>PKR</span>
                  <h4>{pkg.price}</h4>
                  <small>/ Month</small>
                </div>

                <div className="seo-pages">
                  <strong>{pkg.pages}</strong>
                </div>

                <ul className="seo-feature-list">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>
                      <FaCheckCircle />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="seo-order-btn">Order Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
  className={`seo-process-section ${
    isProcessVisible ? "seo-process-active" : ""
  }`}
  ref={processSectionRef}
>
  <div className="seo-process-container">
    <div className="seo-process-heading">
      <span className="seo-process-label">Our SEO Process</span>
      <h2>
        How We'll Work On Your Website To Rank It <br />
        On #1 Page Of <span>Google</span>
      </h2>
    </div>

    <div className="seo-process-marquee">
      <div className="seo-process-track">
        {repeatedProcessSteps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="seo-process-card">
              <div className="seo-process-number">
                {String((index % processSteps.length) + 1).padStart(2, '0')}
              </div>
              <div className="seo-icon-circle">
                <span>{step.icon}</span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>

            {index !== repeatedProcessSteps.length - 1 && (
              <div className="seo-process-arrow">
                <FaLongArrowAltRight />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
</section>
      <section className="seo-cms-tools-section">
        <div className="seo-cms-tools-container">
          {/* CMS Section */}
          <div className="seo-section-heading">
            <span className="seo-mini-title">CMS I Use</span>
            <h2>CMS We're Expert In</h2>
          </div>

          <div className="cms-card-grid">
            {cmsData.map((item, index) => (
              <div className="cms-modern-card" key={index}>
                <div className={`cms-icon-box ${item.className}`}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>

          {/* Tools Section */}
          <div className="seo-section-heading tools-heading">
            <span className="seo-mini-title">Tools</span>
            <h2>Tools We’re Using For SEO Optimization</h2>
          </div>

          <div className="tools-slider-area">
            <div className="tools-slider-window">
              <div className="tools-infinite-track">
                {repeatedTools.map((tool, index) => (
                  <div className="tools-slide-card" key={index}>
                    <div className={`tools-icon-box ${tool.className}`}>
                      {tool.icon}
                    </div>
                    <h3>{tool.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </section>
      <SeoHire/>
      <SeoCaseStudies/>
      <Brand/>
      <Testimonials/>
      <Choose/>
      <SeoFaqs/>
      <SeoContact/>
    </>
  );
};

export default Seo;
