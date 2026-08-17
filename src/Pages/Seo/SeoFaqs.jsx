import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./SeoFaqs.css";
import { hasDbData } from "../../lib/dataHandler";

// Hardcoded defaults
const DEFAULT_FAQS = [
  {
    q: "How SEO Works?",
    a: "SEO works by optimizing your website's content, structure, and authority to rank higher on Google. As a professional SEO expert, I improve on-page, off-page, and technical factors so search engines trust your website and show it to the right audience. Proper SEO services in Pakistan help increase organic traffic, leads, and sales over time.",
  },
  {
    q: "How Much To Pay For SEO Services?",
    a: "The cost of SEO services depends on your industry, competition level, target keywords, and business goals. In Pakistan, professional SEO services typically range from 59,999 to 149,999, depending on the scope of work and selected package. For the exact cost and a customized proposal, just WhatsApp here: +923272462207 — we'll first review your website and guide you accordingly.",
  },
  {
    q: "How SEO Helps Businesses In Pakistan?",
    a: "SEO helps businesses in Pakistan grow by improving their visibility on Google when potential customers search for their products or services. When your website ranks higher, you attract targeted traffic from people who are already interested in what you offer.",
  },
  {
    q: "How Long Does SEO Take To Show Results?",
    a: "SEO typically takes 3 to 6 months to show noticeable improvements. The timeline depends on your competition, website condition, and keyword difficulty.",
  },
  {
    q: "SEO Services Are Worth It?",
    a: "Yes, SEO services are absolutely worth it for long-term business growth. Unlike paid ads, SEO provides sustainable traffic and better ROI over time. Working with a professional SEO expert like Farhan Ali ensures strategic planning, transparency, and measurable improvements in rankings and sales.",
  },
  {
    q: "Who Is The Best SEO Services Provider?",
    a: "Farhan Ali is the best SEO services provider in Pakistan, with expertise in on-page SEO, off-page SEO, technical SEO, keyword research, local SEO, and advanced GEO strategies. As a professional SEO expert, he focuses on data-driven strategies, transparent reporting, and measurable growth to help businesses increase rankings, organic traffic, and generate sales.",
  },
  {
    q: "SEO Packages Cost In Pakistan?",
    a: "A professional SEO expert first audits your website, identifies technical and content-related issues, and notes down key pain points affecting your rankings. Then, a proper action plan is created based on keyword research, competitor analysis, and business goals. The SEO expert optimizes on-page elements, improves technical structure, builds high-quality backlinks, and continuously monitors performance to increase visibility, organic traffic, and conversions.",
  },
  {
    q: "Who Is Professional SEO Expert In Pakistan?",
    a: "Farhan Ali is a professional SEO expert in Pakistan providing complete SEO services in Pakistan, including on-page SEO, off-page SEO, technical SEO, keyword research, and local SEO strategies. With proven ranking experience and a results-driven approach, he helps businesses improve search visibility, increase organic traffic, and generate real sales through structured and transparent SEO campaigns.",
  },
  {
    q: "What Does SEO Expert Do?",
    a: "An SEO expert analyzes your website, performs keyword research, optimizes content, builds backlinks, and fixes technical issues to improve rankings. As an experienced SEO professional, we create a customized SEO strategy that increases visibility, traffic, and conversions.",
  },
  {
    q: "SEO Services Important For Businesses?",
    a: "Yes, SEO services are important for businesses in Pakistan as SEO helps businesses enhance their online presence, reach a wider audience, build stronger brand credibility, attract more potential customers, and achieve sustainable growth in the digital marketplace.",
  },
];

const DEFAULT_FAQS_SECTION = {
  badge: "FAQS",
  heading: "Frequently Asked Questions",
};

const SeoFaqs = ({ faqs, heading }) => {
  const [openItems, setOpenItems] = useState([]);

  // Database-first: Use database data if exists, otherwise use hardcoded defaults
  const displayFaqs = hasDbData(faqs) ? faqs : DEFAULT_FAQS;
  const displayHeading = heading || DEFAULT_FAQS_SECTION.heading;

  const toggleFaq = (index) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const leftFaqs = displayFaqs.filter((_, index) => index % 2 === 0);
  const rightFaqs = displayFaqs.filter((_, index) => index % 2 !== 0);

  const renderFaq = (item, realIndex) => {
    const isOpen = openItems.includes(realIndex);

    return (
      <div className={`seo-faq-item ${isOpen ? "active" : ""}`} key={realIndex}>
        <button className="seo-faq-question" onClick={() => toggleFaq(realIndex)}>
          <span>{item.q || item.question}</span>
          {isOpen ? <FaMinus /> : <FaPlus />}
        </button>

        <div className="seo-faq-answer">
          <div className="seo-faq-answer-inner">
            <p>{item.a || item.answer}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="seo-faq-section">
      <div className="seo-faq-container">
        <div className="seo-faq-heading">
          <span>{DEFAULT_FAQS_SECTION.badge}</span>
          {displayHeading && <h2>{displayHeading}</h2>}
        </div>

        {displayFaqs && displayFaqs.length > 0 && (
          <div className="seo-faq-columns">
            <div className="seo-faq-column">
              {leftFaqs.map((item, i) => renderFaq(item, i * 2))}
            </div>

            <div className="seo-faq-column">
              {rightFaqs.map((item, i) => renderFaq(item, i * 2 + 1))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SeoFaqs;
