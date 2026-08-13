# Update Home Components to Use Supabase Database

## Already Updated ✅
- **Hero.jsx** - Now fetches from database (Home.jsx passes data)
- **Hire.jsx** - Now fetches from database using `fetchHireGigs()`

## Remaining Components to Update

### 1. Service.jsx (Services)
```javascript
// Replace hardcoded services array with:
import { useEffect, useState } from 'react';
import { fetchServices } from '../../lib/supabase-queries';

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section className="service-section">
      {/* Keep existing JSX structure */}
      <div className="service-cards">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            {/* Use service.title, service.description, etc */}
          </div>
        ))}
      </div>
    </section>
  );
};
```

### 2. Process.jsx (Process Steps)
```javascript
import { useEffect, useState } from 'react';
import { fetchProcessSteps } from '../../lib/supabase-queries';

const Process = () => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    fetchProcessSteps().then(data => setSteps(data));
  }, []);

  return (
    <section className="process-section">
      {steps.map((step) => (
        <div key={step.id}>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>
      ))}
    </section>
  );
};
```

### 3. Testimonials.jsx
```javascript
import { fetchHomeTestimonials } from '../../lib/supabase-queries';
// Fetch testimonials and render from database
```

### 4. Brand.jsx (Brands)
```javascript
import { fetchBrands } from '../../lib/supabase-queries';
// Fetch and display logos from database
```

### 5. Choose.jsx (Why Choose Me)
```javascript
import { fetchChooseFeatures } from '../../lib/supabase-queries';
// Fetch features and display
```

### 6. Portfolio_Section.jsx
```javascript
import { fetchHomePortfolioItems } from '../../lib/supabase-queries';
// Fetch portfolio items from database
```

### 7. About_Section.jsx
```javascript
import { fetchAbout } from '../../lib/supabase-queries';
// Fetch about data from database
```

### 8. Contact_Section.jsx
```javascript
import { fetchContactSection } from '../../lib/supabase-queries';
// Fetch contact info from database
```

## Quick Implementation Pattern

For each component, follow this pattern:

```javascript
import { useEffect, useState } from 'react';
import { fetchXXX } from '../../lib/supabase-queries';

const ComponentName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await fetchXXX();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section>
      {/* Render data from state instead of hardcoded values */}
    </section>
  );
};

export default ComponentName;
```

## Next Steps

1. ✅ **Seed Database** - Run the seed SQL in Supabase
2. ⏳ **Update Components** - Follow the pattern above for each component
3. ⏳ **Test** - Refresh browser and verify data shows correctly
4. ⏳ **Update AdminHomeComponents** - Add admin UI for managing each component

## Database Queries Available

All queries are in `/src/lib/supabase-queries.js`:
- `fetchHero()`
- `fetchServices()`
- `fetchAbout()`
- `fetchHireGigs()`
- `fetchProcessSteps()`
- `fetchHomeTestimonials()`
- `fetchBrands()`
- `fetchChooseFeatures()`
- `fetchHomePortfolioItems()`
- `fetchContactSection()`

Use these in your components!
