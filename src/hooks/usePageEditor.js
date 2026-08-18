import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export const usePageEditor = (pageId = null) => {
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    template_type: 'static',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    og_type: 'website',
    canonical_url: '',
    robots_directive: 'index,follow',
    focus_keyword: '',
    twitter_card: 'summary_large_image',
    twitter_creator: '',
    seo_score: 0,
    view_count: 0,
    parent_page_id: '',
    visibility: 'public',
    show_in_navbar: false,
    show_in_footer: false
  });

  const [seoMetadata, setSeoMetadata] = useState({
    h1_count: 0,
    h2_count: 0,
    h3_count: 0,
    internal_links_count: 0,
    external_links_count: 0,
    images_with_alt_count: 0,
    images_without_alt_count: 0,
    has_canonical: false,
    has_open_graph: false,
    has_schema_markup: false,
    keywords_in_title: false,
    keywords_in_description: false,
    keywords_in_h1: false
  });

  const [keywords, setKeywords] = useState([]);
  const [allPages, setAllPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Never');

  const supabase = getSupabaseClient();

  // Load pages list and single page if editing
  useEffect(() => {
    loadAllPages();
    if (pageId) {
      loadPage();
    }
  }, [pageId]);

  const loadAllPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, slug, title, template_type')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllPages(data || []);
    } catch (err) {
      console.error('Error loading pages:', err);
    }
  };

  const loadPage = async () => {
    if (!pageId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          metadata:page_seo_metadata(*),
          keywords:page_seo_keywords(*)
        `)
        .eq('id', pageId)
        .single();

      if (error) throw error;

      setFormData(data);
      if (data.metadata) setSeoMetadata(data.metadata);
      if (data.keywords) setKeywords(data.keywords);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = useCallback((key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  }, []);

  const calculateSEOScore = (data, metadata) => {
    let score = 0;

    if (data.meta_title && data.meta_title.length >= 30 && data.meta_title.length <= 60) {
      score += 15;
    }

    if (data.meta_description && data.meta_description.length >= 120 && data.meta_description.length <= 160) {
      score += 15;
    }

    if (data.focus_keyword && data.title.toLowerCase().includes(data.focus_keyword.toLowerCase())) {
      score += 15;
    }

    if (data.canonical_url) {
      score += 10;
    }

    if (data.og_title && data.og_description) {
      score += 10;
    }

    if (data.robots_directive === 'index,follow') {
      score += 5;
    }

    if (data.show_in_navbar) {
      score += 5;
    }

    if (data.status === 'published') {
      score += 10;
    }

    if (metadata?.has_schema_markup) {
      score += 5;
    }

    return Math.min(score, 100);
  };

  const analyzeContent = async (htmlContent) => {
    const text = htmlContent.replace(/<[^>]*>/g, '');

    const h1Matches = (htmlContent.match(/<h1>/gi) || []).length;
    const h2Matches = (htmlContent.match(/<h2>/gi) || []).length;
    const h3Matches = (htmlContent.match(/<h3>/gi) || []).length;
    const internalLinks = (htmlContent.match(/href="\/[^"]*"/gi) || []).length;
    const externalLinks = (htmlContent.match(/href="https?:\/\/[^"]*"/gi) || []).length;
    const imgsWithAlt = (htmlContent.match(/<img[^>]*alt="[^"]+"/gi) || []).length;
    const imgsWithoutAlt = (htmlContent.match(/<img(?![^>]*alt=)/gi) || []).length;

    const hasCanonical = formData.canonical_url && formData.canonical_url.length > 0;
    const hasOG = formData.og_title && formData.og_description;
    const hasKeywordInTitle = formData.focus_keyword && formData.title.toLowerCase().includes(formData.focus_keyword.toLowerCase());
    const hasKeywordInH1 = formData.focus_keyword && htmlContent.toLowerCase().includes(`<h1>${formData.focus_keyword}</h1>`.toLowerCase());

    const newMetadata = {
      h1_count: h1Matches,
      h2_count: h2Matches,
      h3_count: h3Matches,
      internal_links_count: internalLinks,
      external_links_count: externalLinks,
      images_with_alt_count: imgsWithAlt,
      images_without_alt_count: imgsWithoutAlt,
      has_canonical: hasCanonical,
      has_open_graph: hasOG,
      has_schema_markup: false,
      keywords_in_title: hasKeywordInTitle,
      keywords_in_description: formData.focus_keyword && formData.meta_description.toLowerCase().includes(formData.focus_keyword.toLowerCase()),
      keywords_in_h1: hasKeywordInH1
    };

    setSeoMetadata(newMetadata);
    return newMetadata;
  };

  const savePage = async () => {
    setLoading(true);
    try {
      const seoScore = calculateSEOScore(formData, seoMetadata);

      const pageData = {
        ...formData,
        seo_score: seoScore
      };

      let result;
      if (pageId) {
        const { data, error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', pageId)
          .select()
          .single();

        if (error) throw error;
        result = data;

        // Update SEO metadata
        if (seoMetadata.id) {
          await supabase
            .from('page_seo_metadata')
            .update(seoMetadata)
            .eq('id', seoMetadata.id);
        } else {
          await supabase
            .from('page_seo_metadata')
            .insert([{ page_id: result.id, ...seoMetadata }]);
        }
      } else {
        const { data, error } = await supabase
          .from('pages')
          .insert([pageData])
          .select()
          .single();

        if (error) throw error;
        result = data;

        // Create SEO metadata
        await supabase
          .from('page_seo_metadata')
          .insert([{ page_id: result.id, ...seoMetadata }]);
      }

      setFormData(prev => ({
        ...prev,
        id: result.id,
        seo_score: seoScore
      }));

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString());
      return result;
    } catch (err) {
      console.error('Error saving page:', err);
      setError('Failed to save page');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishPage = async () => {
    setLoading(true);
    try {
      const seoScore = calculateSEOScore(formData, seoMetadata);

      const pageData = {
        ...formData,
        status: 'published',
        seo_score: seoScore
      };

      let result;
      if (pageId) {
        const { data, error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', pageId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('pages')
          .insert([pageData])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString());
      return result;
    } catch (err) {
      console.error('Error publishing page:', err);
      setError('Failed to publish page');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addKeywords = async (newKeywords) => {
    try {
      if (!formData.id) {
        setError('Save page first before adding keywords');
        return;
      }

      const keywordRecords = newKeywords.map((kw, idx) => ({
        page_id: formData.id,
        keyword: typeof kw === 'string' ? kw : kw.keyword,
        is_primary: idx === 0,
        keyword_density: kw.density || 0
      }));

      const { data, error } = await supabase
        .from('page_seo_keywords')
        .upsert(keywordRecords, { onConflict: 'page_id,keyword' })
        .select();

      if (error) throw error;
      setKeywords(data || []);
      return data;
    } catch (err) {
      console.error('Error adding keywords:', err);
      setError('Failed to add keywords');
      throw err;
    }
  };

  const deletePage = async () => {
    if (!pageId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting page:', err);
      setError('Failed to delete page');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPageOptions = () => {
    return allPages.map(page => ({
      id: page.id,
      label: page.title,
      value: page.id
    }));
  };

  return {
    formData,
    seoMetadata,
    keywords,
    allPages,
    loading,
    error,
    hasUnsavedChanges,
    lastSavedTime,
    updateFormData,
    setSeoMetadata,
    savePage,
    publishPage,
    deletePage,
    addKeywords,
    analyzeContent,
    calculateSEOScore,
    getPageOptions
  };
};
