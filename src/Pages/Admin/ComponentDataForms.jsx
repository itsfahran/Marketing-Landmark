import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../../lib/supabase';
import { COMPONENTS } from '../../lib/pageBuilderConfig';
import ScopeCardManager from './ScopeCardManager';
import PricingManager from './PricingManager';
import ProcessStepsManager from './ProcessStepsManager';
import CMSManager from './CMSManager';
import HireManager from './HireManager';
import CaseStudiesManager from './CaseStudiesManager';
import './ComponentDataForms.css';

const ComponentDataForms = ({ pageId, selectedComponents }) => {
  const supabase = getSupabaseClient();
  const [componentData, setComponentData] = useState({});
  const [loading, setLoading] = useState(!pageId);
  const [openManager, setOpenManager] = useState(null);

  useEffect(() => {
    if (pageId) {
      loadComponentData();
    }
  }, [pageId, selectedComponents]);

  const loadComponentData = async () => {
    try {
      const data = {};

      for (const comp of selectedComponents) {
        const tableName = `component_${comp.id}`;
        try {
          const { data: compData } = await supabase
            .from(tableName)
            .select('*')
            .eq('page_id', pageId)
            .eq('template', comp.template)
            .single();

          if (compData) {
            data[`${comp.id}-${comp.template}`] = compData;
          }
        } catch (e) {
          // Component data doesn't exist yet
        }
      }

      setComponentData(data);
    } catch (err) {
      console.error('Error loading component data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (componentId, template, field, value) => {
    const key = `${componentId}-${template}`;
    setComponentData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSaveComponent = async (componentId, template) => {
    if (!pageId) {
      alert('Please save page first');
      return;
    }

    try {
      const key = `${componentId}-${template}`;
      const data = componentData[key];
      const tableName = `component_${componentId}`;

      if (data && data.id) {
        // Update existing
        await supabase
          .from(tableName)
          .update(data)
          .eq('id', data.id);
      } else {
        // Insert new
        await supabase.from(tableName).insert({
          ...data,
          page_id: pageId,
          template: template,
        });
      }

      alert(`${COMPONENTS[componentId].name} saved!`);
      loadComponentData();
    } catch (err) {
      console.error('Error saving:', err);
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div className="cdf-loading">Loading...</div>;
  }

  // Get component IDs
  const scopeComp = selectedComponents.find(c => c.id === 'scope');
  const pricingComp = selectedComponents.find(c => c.id === 'pricing');
  const processComp = selectedComponents.find(c => c.id === 'process');
  const cmsComp = selectedComponents.find(c => c.id === 'cms');
  const hireComp = selectedComponents.find(c => c.id === 'hire');
  const casestudiesComp = selectedComponents.find(c => c.id === 'casestudies');

  return (
    <div className="cdf-container">
      {selectedComponents.map(comp => (
        <ComponentForm
          key={`${comp.id}-${comp.template}`}
          componentId={comp.id}
          template={comp.template}
          data={componentData[`${comp.id}-${comp.template}`] || {}}
          onChange={(field, value) =>
            handleInputChange(comp.id, comp.template, field, value)
          }
          onSave={() => handleSaveComponent(comp.id, comp.template)}
          setOpenManager={setOpenManager}
        />
      ))}

      {/* MANAGERS MODALS */}
      {scopeComp && openManager === 'scope' && (
        <ScopeCardManager
          scopeData={componentData[`${scopeComp.id}-${scopeComp.template}`]}
          pageId={pageId}
          template={scopeComp.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {pricingComp && openManager === 'pricing' && (
        <PricingManager
          pricingData={componentData[`${pricingComp.id}-${pricingComp.template}`]}
          pageId={pageId}
          template={pricingComp.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {processComp && openManager === 'process' && (
        <ProcessStepsManager
          processData={componentData[`${processComp.id}-${processComp.template}`]}
          pageId={pageId}
          template={processComp.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {cmsComp && openManager === 'cms' && (
        <CMSManager
          cmsData={componentData[`${cmsComp.id}-${cmsComp.template}`]}
          pageId={pageId}
          template={cmsComp.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {hireComp && openManager === 'hire' && (
        <HireManager
          hireData={componentData[`${hireComp.id}-${hireComp.template}`]}
          pageId={pageId}
          template={hireComp.template}
          onClose={() => setOpenManager(null)}
        />
      )}

      {casestudiesComp && openManager === 'casestudies' && (
        <CaseStudiesManager
          casestudiesData={componentData[`${casestudiesComp.id}-${casestudiesComp.template}`]}
          pageId={pageId}
          template={casestudiesComp.template}
          onClose={() => setOpenManager(null)}
        />
      )}
    </div>
  );
};

function ComponentForm({ componentId, template, data, onChange, onSave, setOpenManager }) {
  const compInfo = COMPONENTS[componentId];

  return (
    <div className="cdf-form-section">
      <div className="cdf-form-header">
        <h3>
          <span className="cdf-icon">{compInfo.icon}</span>
          {compInfo.name} ({template})
        </h3>
        <button className="cdf-save-btn" onClick={onSave}>
          Save
        </button>
      </div>

      <div className="cdf-form-body">
        {/* HERO Component Fields */}
        {componentId === 'hero' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Subheading"
              value={data.subheading || ''}
              onChange={(v) => onChange('subheading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />

            {template === 'GEO' && (
              <>
                <FormField
                  label="Heading Accent"
                  value={data.geo_heading_accent || ''}
                  onChange={(v) => onChange('geo_heading_accent', v)}
                />
                <FormField
                  label="Feature 1"
                  value={data.geo_feature_1 || ''}
                  onChange={(v) => onChange('geo_feature_1', v)}
                />
                <FormField
                  label="Feature 2"
                  value={data.geo_feature_2 || ''}
                  onChange={(v) => onChange('geo_feature_2', v)}
                />
                <FormField
                  label="Feature 3"
                  value={data.geo_feature_3 || ''}
                  onChange={(v) => onChange('geo_feature_3', v)}
                />
                <FormField
                  label="CTA 1 Text"
                  value={data.geo_cta1_text || ''}
                  onChange={(v) => onChange('geo_cta1_text', v)}
                />
                <FormField
                  label="CTA 1 Link"
                  value={data.geo_cta1_link || ''}
                  onChange={(v) => onChange('geo_cta1_link', v)}
                />
                <FormField
                  label="CTA 2 Text"
                  value={data.geo_cta2_text || ''}
                  onChange={(v) => onChange('geo_cta2_text', v)}
                />
                <FormField
                  label="CTA 2 Link"
                  value={data.geo_cta2_link || ''}
                  onChange={(v) => onChange('geo_cta2_link', v)}
                />
              </>
            )}

            {template === 'SEO' && (
              <>
                <FormField
                  label="Badge"
                  value={data.seo_badge || ''}
                  onChange={(v) => onChange('seo_badge', v)}
                />
                <FormField
                  label="Feature 1"
                  value={data.seo_feature_1 || ''}
                  onChange={(v) => onChange('seo_feature_1', v)}
                />
                <FormField
                  label="Feature 2"
                  value={data.seo_feature_2 || ''}
                  onChange={(v) => onChange('seo_feature_2', v)}
                />
                <FormField
                  label="Feature 3"
                  value={data.seo_feature_3 || ''}
                  onChange={(v) => onChange('seo_feature_3', v)}
                />
              </>
            )}
          </>
        )}

        {/* SCOPE Component Fields */}
        {componentId === 'scope' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <button
              className="cdf-manage-btn"
              onClick={() => setOpenManager('scope')}
            >
              📝 Manage Scope Cards
            </button>
          </>
        )}

        {/* PRICING Component Fields */}
        {componentId === 'pricing' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <button
              className="cdf-manage-btn"
              onClick={() => setOpenManager('pricing')}
            >
              💰 Manage Pricing Packages
            </button>
          </>
        )}

        {/* PROCESS Component Fields */}
        {componentId === 'process' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <button
              className="cdf-manage-btn"
              onClick={() => setOpenManager('process')}
            >
              🔄 Manage Process Steps
            </button>
          </>
        )}

        {/* FEATURES Component Fields */}
        {componentId === 'features' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <p className="cdf-note">Add feature items separately</p>
          </>
        )}

        {/* TESTIMONIALS Component Fields */}
        {componentId === 'testimonials' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <p className="cdf-note">Add testimonials separately</p>
          </>
        )}

        {/* CTA Component Fields */}
        {componentId === 'cta' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <FormField
              label="Button Text"
              value={data.button_text || ''}
              onChange={(v) => onChange('button_text', v)}
            />
            <FormField
              label="Button Link"
              value={data.button_link || ''}
              onChange={(v) => onChange('button_link', v)}
            />
          </>
        )}

        {/* CONTACT Component Fields */}
        {componentId === 'contact' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <FormField
              label="Email"
              type="email"
              value={data.email || ''}
              onChange={(v) => onChange('email', v)}
            />
            <FormField
              label="Phone"
              value={data.phone || ''}
              onChange={(v) => onChange('phone', v)}
            />
          </>
        )}

        {/* ABOUT Component Fields */}
        {componentId === 'about' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <FormField
              label="Image URL"
              value={data.image_url || ''}
              onChange={(v) => onChange('image_url', v)}
            />
          </>
        )}

        {/* CMS Component Fields */}
        {componentId === 'cms' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <button
              className="cdf-manage-btn"
              onClick={() => setOpenManager('cms')}
            >
              💻 Manage CMS Items
            </button>
          </>
        )}

        {/* HIRE Component Fields */}
        {componentId === 'hire' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <button
              className="cdf-manage-btn"
              onClick={() => setOpenManager('hire')}
            >
              💼 Manage Hire/Gigs
            </button>
          </>
        )}

        {/* CASESTUDIES Component Fields */}
        {componentId === 'casestudies' && (
          <>
            <FormField
              label="Heading"
              value={data.heading || ''}
              onChange={(v) => onChange('heading', v)}
            />
            <FormField
              label="Description"
              type="textarea"
              value={data.description || ''}
              onChange={(v) => onChange('description', v)}
            />
            <button
              className="cdf-manage-btn"
              onClick={() => setOpenManager('casestudies')}
            >
              📸 Manage Case Studies
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function FormField({ label, type = 'text', value, onChange }) {
  return (
    <div className="cdf-field">
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          rows={4}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
        />
      )}
    </div>
  );
}

export default ComponentDataForms;
