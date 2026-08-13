# Component Update Templates - Copy & Paste Ready

## Template 1: Process.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./Process.css";
import { fetchProcessSteps } from "../../lib/supabase-queries";

const Process = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSteps();
  }, []);

  const loadSteps = async () => {
    try {
      const data = await fetchProcessSteps();
      setSteps(data);
    } catch (error) {
      console.error("Error loading steps:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="process-section"><h2>Loading...</h2></section>;

  return (
    <section className="process-section">
      <h2>Our Process</h2>
      <div className="process-container">
        {steps.map((step) => (
          <div key={step.id} className="process-card">
            <div className="process-number">{step.step_number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;
```

## Template 2: Testimonials.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./Testimonials.css";
import { FaStar } from "react-icons/fa";
import { fetchHomeTestimonials } from "../../lib/supabase-queries";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await fetchHomeTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="testimonial-section"><h2>Loading...</h2></section>;

  return (
    <section className="testimonial-section">
      <h2>What Clients Say</h2>
      <div className="testimonials-container">
        {testimonials.map((t) => (
          <div key={t.id} className="testimonial-card">
            <div className="stars">
              {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
            </div>
            <p className="text">"{t.testimonial_text}"</p>
            <h4>{t.client_name}</h4>
            <p className="title">{t.client_title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
```

## Template 3: Brand.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./Brand.css";
import { fetchBrands } from "../../lib/supabase-queries";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await fetchBrands();
      setBrands(data);
    } catch (error) {
      console.error("Error loading brands:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="brand-section"><h2>Loading...</h2></section>;

  return (
    <section className="brand-section">
      <h2>Trusted By Leading Brands</h2>
      <div className="brands-container">
        {brands.map((brand) => (
          <div key={brand.id} className="brand-item">
            <img src={`/assets/${brand.logo_url}`} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Brand;
```

## Template 4: Choose.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./Choose.css";
import { fetchChooseFeatures } from "../../lib/supabase-queries";

const Choose = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const data = await fetchChooseFeatures();
      setFeatures(data);
    } catch (error) {
      console.error("Error loading features:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="choose-section"><h2>Loading...</h2></section>;

  return (
    <section className="choose-section">
      <h2>Why Choose Me</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Choose;
```

## Template 5: Portfolio_Section.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./Portfolio-Section.css";
import { fetchHomePortfolioItems } from "../../lib/supabase-queries";

const Portfolio_Section = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await fetchHomePortfolioItems();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <section className="portfolio-section"><h2>Loading...</h2></section>;

  return (
    <section className="portfolio-section">
      <h2>Featured Projects</h2>
      <div className="portfolio-grid">
        {projects.map((project) => (
          <div key={project.id} className="portfolio-card">
            {project.image_url && <img src={`/assets/${project.image_url}`} alt={project.title} />}
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Portfolio_Section;
```

## Template 6: About_Section.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./About-Section.css";
import { fetchAbout } from "../../lib/supabase-queries";

const About_Section = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await fetchAbout();
      setAbout(data);
    } catch (error) {
      console.error("Error loading about:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !about) return <section className="about-section"><h2>Loading...</h2></section>;

  return (
    <section className="about-section">
      <div className="about-container">
        <h2>{about.heading}</h2>
        <p>{about.description}</p>
        <div className="about-stats">
          <div className="stat">
            <h3>{about.years_experience}+</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat">
            <h3>{about.total_projects}+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stat">
            <h3>{about.satisfaction_rate}%</h3>
            <p>Client Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Section;
```

## Template 7: Contact_Section.jsx
```javascript
import React, { useEffect, useState } from "react";
import "./Contact_Section.css";
import { fetchContactSection } from "../../lib/supabase-queries";

const Contact_Section = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const data = await fetchContactSection();
      setContact(data);
    } catch (error) {
      console.error("Error loading contact:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !contact) return <section className="contact-section"><h2>Loading...</h2></section>;

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2>{contact.heading}</h2>
        <p>{contact.description}</p>
        <div className="contact-info">
          {contact.email && <p>📧 {contact.email}</p>}
          {contact.phone && <p>📞 {contact.phone}</p>}
          {contact.address && <p>📍 {contact.address}</p>}
        </div>
      </div>
    </section>
  );
};

export default Contact_Section;
```

## How to Use These Templates

1. **Copy the template for each component**
2. **Replace the existing component file content**
3. **Test the component** - refresh the page and verify data loads from database
4. **Repeat for all 7 components**

All components follow the same pattern:
- ✅ useEffect to load data on mount
- ✅ useState for data and loading state
- ✅ Proper error handling
- ✅ Loading state UI
- ✅ Database queries from supabase-queries.js

Just copy-paste and go! 🚀
