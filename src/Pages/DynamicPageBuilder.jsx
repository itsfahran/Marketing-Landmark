import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabase';
import { COMPONENTS } from '../lib/pageBuilderConfig';
import { COMPONENT_RENDERER_MAP } from '../lib/componentExtractor';

const DynamicPageBuilder = () => {
  const { slug } = useParams();
  const supabase = getSupabaseClient();

  const [page, setPage] = useState(null);
  const [componentDataMap, setComponentDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPageAndData();
  }, [slug]);

  const loadPageAndData = async () => {
    try {
      // 1. Fetch page configuration
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (pageError || !pageData) {
        setError('Page not found');
        setLoading(false);
        return;
      }

      setPage(pageData);

      // 2. Load data for each SELECTED component
      const dataMap = {};
      const componentsConfig = pageData.components_config || [];
      const enabledComponents = componentsConfig.filter(c => c.enabled);

      for (const comp of enabledComponents) {
        try {
          const tableName = `component_${comp.id}`;
          const { data: compData } = await supabase
            .from(tableName)
            .select('*')
            .eq('page_id', pageData.id)
            .eq('template', comp.template)
            .single();

          if (compData) {
            // Fetch related sub-items based on component type
            if (comp.id === 'scope') {
              const { data: cards } = await supabase
                .from('component_scope_cards')
                .select('*')
                .eq('scope_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.scopeCards = cards || [];
            } else if (comp.id === 'pricing') {
              const { data: packages } = await supabase
                .from('component_pricing_packages')
                .select(`
                  *,
                  features:component_pricing_features(*)
                `)
                .eq('pricing_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.pricing = packages || [];
            } else if (comp.id === 'process') {
              const { data: steps } = await supabase
                .from('component_process_steps')
                .select('*')
                .eq('process_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.processSteps = steps || [];
            } else if (comp.id === 'cms') {
              const { data: cmsItems } = await supabase
                .from('component_cms_items')
                .select('*')
                .eq('cms_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.items = cmsItems || [];
            } else if (comp.id === 'hire') {
              const { data: hireItems } = await supabase
                .from('component_hire_items')
                .select('*')
                .eq('hire_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.items = hireItems || [];
            } else if (comp.id === 'casestudies') {
              const { data: caseItems } = await supabase
                .from('component_casestudies_items')
                .select('*')
                .eq('casestudies_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.items = caseItems || [];
            } else if (comp.id === 'videotestimonials') {
              const { data: videoItems } = await supabase
                .from('component_videotestimonials_items')
                .select('*')
                .eq('videotestimonials_id', compData.id)
                .order('sort_order', { ascending: true });
              compData.items = videoItems || [];
            }

            dataMap[`${comp.id}-${comp.template}`] = compData;
          }
        } catch (e) {
          // Component data doesn't exist, skip
          console.log(`No data found for ${comp.id} (${comp.template})`);
        }
      }

      setComponentDataMap(dataMap);
      setLoading(false);
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Error loading page');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#666' }}>
        Loading page...
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#d32f2f' }}>
        <h2>Error</h2>
        <p>{error || 'Page not found'}</p>
      </div>
    );
  }

  const componentsConfig = page.components_config || [];
  const enabledComponents = componentsConfig
    .filter(c => c.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="dynamic-page-builder">
      {enabledComponents.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          No components configured for this page
        </div>
      ) : (
        enabledComponents.map((comp, idx) => (
          <ComponentRenderer
            key={`${comp.id}-${idx}`}
            componentId={comp.id}
            template={comp.template}
            data={componentDataMap[`${comp.id}-${comp.template}`]}
          />
        ))
      )}
    </div>
  );
};

function ComponentRenderer({ componentId, template, data }) {
  const compInfo = COMPONENTS[componentId];

  if (!compInfo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fff3cd', color: '#856404' }}>
        ⚠️ Unknown component: {componentId}
      </div>
    );
  }

  // Get the component class from the renderer map
  const ComponentClass = COMPONENT_RENDERER_MAP[componentId]?.[template];

  if (!ComponentClass) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fff3cd', color: '#856404' }}>
        ⚠️ No {template} variant for {compInfo.name}
      </div>
    );
  }

  // Render the extracted component with its data
  return (
    <ComponentClass data={data || {}} />
  );
}

export default DynamicPageBuilder;
