# 📋 Refactor Examples — Before & After

Complete working examples for each type of component.

---

## Example 1: Simple Hero Component

### ❌ BEFORE (Wrong)
```jsx
const Geo = ({ serviceData }) => {
  const heroData = serviceData;
  return (
    <h1>
      {heroData?.geo_heading || "HI"}
      <span>{heroData?.geo_heading_accent || 'Professional GEO Services'}</span>
    </h1>
  );
};
```

**Problem:** If admin saves heading but not accent, both show (one DB, one hardcoded)

### ✅ AFTER (Correct)
```jsx
import { hasDbData } from "../../lib/dataHandler";

// Define hardcoded defaults
const DEFAULT_GEO_HERO = {
  geo_heading: "HI",
  geo_heading_accent: "Professional GEO Services",
};

const Geo = ({ serviceData }) => {
  const heroData = serviceData;
  
  // Use DB data if exists, otherwise use defaults
  const displayData = hasDbData(heroData) ? heroData : DEFAULT_GEO_HERO;
  
  return (
    <>
      {displayData.geo_heading && (
        <h1>
          {displayData.geo_heading}
          {displayData.geo_heading_accent && (
            <span>{displayData.geo_heading_accent}</span>
          )}
        </h1>
      )}
    </>
  );
};
```

**Result:** Either shows DB data OR hardcoded, never both!

---

## Example 2: Section with Multiple Fields

### ❌ BEFORE (Wrong)
```jsx
const GeoModernInfo = ({ heroData }) => {
  return (
    <section>
      <h2>
        {heroData?.geo_modern_heading || "How GEO Helps Modern Websites"}
        <span>{heroData?.geo_modern_subheading || "Rank In AI Search Results"}</span>
      </h2>
      
      <p>
        {heroData?.geo_modern_description || "AI-powered search engines..."}
      </p>
      
      <div className="points">
        <div><strong>01</strong> {heroData?.geo_modern_item_1_title || "Structured content"}</div>
        <div><strong>02</strong> {heroData?.geo_modern_item_2_title || "Better visibility"}</div>
        <div><strong>03</strong> {heroData?.geo_modern_item_3_title || "Authority strategy"}</div>
      </div>
    </section>
  );
};
```

### ✅ AFTER (Correct)
```jsx
import { hasDbData } from "../../lib/dataHandler";

const DEFAULT_GEO_MODERN = {
  geo_modern_heading: "How GEO Helps Modern Websites",
  geo_modern_subheading: "Rank In AI Search Results",
  geo_modern_description: "AI-powered search engines...",
  geo_modern_item_1_title: "Structured content",
  geo_modern_item_2_title: "Better visibility",
  geo_modern_item_3_title: "Authority strategy",
};

const GeoModernInfo = ({ heroData }) => {
  const displayData = hasDbData(heroData) ? heroData : DEFAULT_GEO_MODERN;
  
  return (
    <section>
      {displayData.geo_modern_heading && (
        <h2>
          {displayData.geo_modern_heading}
          {displayData.geo_modern_subheading && (
            <span>{displayData.geo_modern_subheading}</span>
          )}
        </h2>
      )}
      
      {displayData.geo_modern_description && (
        <p>{displayData.geo_modern_description}</p>
      )}
      
      {(displayData.geo_modern_item_1_title || 
        displayData.geo_modern_item_2_title || 
        displayData.geo_modern_item_3_title) && (
        <div className="points">
          {displayData.geo_modern_item_1_title && (
            <div><strong>01</strong> {displayData.geo_modern_item_1_title}</div>
          )}
          {displayData.geo_modern_item_2_title && (
            <div><strong>02</strong> {displayData.geo_modern_item_2_title}</div>
          )}
          {displayData.geo_modern_item_3_title && (
            <div><strong>03</strong> {displayData.geo_modern_item_3_title}</div>
          )}
        </div>
      )}
    </section>
  );
};
```

---

## Example 3: Array/List Component

### ❌ BEFORE (Wrong)
```jsx
const ScopeCards = ({ scopeCards }) => {
  const cards = scopeCards || [
    { title: "Card 1", description: "Description 1" },
    { title: "Card 2", description: "Description 2" },
  ];
  
  return (
    <div className="cards">
      {cards.map(card => (
        <div key={card.id}>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### ✅ AFTER (Correct)
```jsx
import { hasDbData } from "../../lib/dataHandler";

const DEFAULT_SCOPE_CARDS = [
  { id: 1, title: "Card 1", description: "Description 1" },
  { id: 2, title: "Card 2", description: "Description 2" },
];

const ScopeCards = ({ scopeCards }) => {
  // Use DB data only if it exists, otherwise hardcoded
  const displayCards = hasDbData(scopeCards) ? scopeCards : DEFAULT_SCOPE_CARDS;
  
  return (
    <div className="cards">
      {displayCards.map(card => (
        <div key={card.id}>
          {card.title && <h3>{card.title}</h3>}
          {card.description && <p>{card.description}</p>}
        </div>
      ))}
    </div>
  );
};
```

---

## Example 4: Complex Section (Full Conditional)

### ❌ BEFORE (Wrong)
```jsx
const PricingSection = ({ pricing }) => {
  const packages = pricing?.packages || DEFAULT_PACKAGES;
  
  return (
    <section>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name || "Package Name"}</h3>
          <p className="price">{pkg.price || "$999"}</p>
          <ul>
            {pkg.features?.map((feat, i) => (
              <li key={i}>{feat.title || "Feature"}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
```

### ✅ AFTER (Correct)
```jsx
import { hasDbData } from "../../lib/dataHandler";

const DEFAULT_PRICING = {
  packages: [
    { id: 1, name: "Basic", price: "$999", features: [{ title: "Feature 1" }] },
    { id: 2, name: "Pro", price: "$1999", features: [{ title: "Feature 2" }] },
  ],
};

const PricingSection = ({ pricing }) => {
  // Use ONLY DB or ONLY hardcoded, never mix
  const displayData = hasDbData(pricing) ? pricing : DEFAULT_PRICING;
  
  if (!displayData || !displayData.packages?.length) {
    return null; // Don't render if no data
  }
  
  return (
    <section>
      {displayData.packages.map(pkg => (
        pkg.name && ( // Only render if package has name
          <div key={pkg.id}>
            <h3>{pkg.name}</h3>
            {pkg.price && <p className="price">{pkg.price}</p>}
            {pkg.features?.length > 0 && (
              <ul>
                {pkg.features
                  .filter(feat => feat.title) // Only show features with titles
                  .map((feat, i) => (
                    <li key={i}>{feat.title}</li>
                  ))}
              </ul>
            )}
          </div>
        )
      ))}
    </section>
  );
};
```

---

## Example 5: Multi-Version Component

### ❌ BEFORE (Wrong)
```jsx
const ProcessSteps = ({ steps }) => {
  const displaySteps = steps || [
    { icon: "⚙️", title: "Setup", desc: "Configure system" },
    { icon: "📊", title: "Analyze", desc: "Analyze data" },
  ];
  
  return (
    <div className="steps">
      {displaySteps.map((step, i) => (
        <div key={i}>
          <span className="icon">{step.icon || "📌"}</span>
          <h4>{step.title || "Step Title"}</h4>
          <p>{step.desc || "Description"}</p>
        </div>
      ))}
    </div>
  );
};
```

### ✅ AFTER (Correct)
```jsx
import { hasDbData, renderDbOrHardcoded } from "../../lib/dataHandler";

const DEFAULT_STEPS = [
  { icon: "⚙️", title: "Setup", desc: "Configure system" },
  { icon: "📊", title: "Analyze", desc: "Analyze data" },
];

const ProcessSteps = ({ steps }) => {
  // Use renderDbOrHardcoded for complete conditional rendering
  return renderDbOrHardcoded(
    steps,
    // If DB data exists
    (dbSteps) => (
      <div className="steps">
        {dbSteps
          .filter(step => step.title) // Only show steps with titles
          .map((step, i) => (
            <div key={i}>
              {step.icon && <span className="icon">{step.icon}</span>}
              <h4>{step.title}</h4>
              {step.desc && <p>{step.desc}</p>}
            </div>
          ))}
      </div>
    ),
    // If no DB data
    () => (
      <div className="steps">
        {DEFAULT_STEPS.map((step, i) => (
          <div key={i}>
            <span className="icon">{step.icon}</span>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    )
  );
};
```

---

## Example 6: Generic Component (No Changes Needed)

Some components already fetch from DB and don't need updating:

### ✅ TESTIMONIALS (Already DB-First)
```jsx
const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  
  useEffect(() => {
    fetchHomeTestimonials().then(setTestimonials);
  }, []);
  
  if (!testimonials.length) {
    return null; // Don't render if no DB data
  }
  
  return (
    <div>
      {testimonials.map(t => (
        <TestimonialCard key={t.id} data={t} />
      ))}
    </div>
  );
};
```

✅ Good! This doesn't mix with hardcoded defaults.

---

## Quick Cheat Sheet

### Change This:
```
{field || "hardcoded"}
field || fallback
value ? value : "default"
spread operator with defaults
```

### To This:
```
const data = hasDbData(dbData) ? dbData : DEFAULTS;
{data.field}
{displayData?.field && <Component>{displayData.field}</Component>}
renderDbOrHardcoded(dbData, renderDB, renderHardcoded)
```

---

## Testing Each Pattern

### Test Pattern 1:
```jsx
// Test with no data
<Component serviceData={null} />
// Should show hardcoded

// Test with data
<Component serviceData={{ heading: "DB Heading" }} />
// Should show ONLY DB heading, not hardcoded
```

### Test Pattern 2:
```jsx
// Test with partial data
<Component serviceData={{ title: "DB Title" }} />
// Should show: title ✅
// Should NOT show: description (even if hardcoded)
```

### Test Pattern 3:
```jsx
// Test with empty array
<Component items={[]} />
// Should show hardcoded OR nothing

// Test with DB array
<Component items={[{...}]} />
// Should show ONLY DB items
```

---

**Use these examples as templates for all components!**
