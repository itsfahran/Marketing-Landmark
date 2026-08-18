import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export const useBlogEditor = (blogId = null) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    featured_image_alt_text: '',
    featured_image_title: '',
    featured_image_caption: '',
    category_id: '',
    author_id: '',
    tags: [],
    focus_keyword: '',
    meta_title: '',
    meta_description: '',
    og_title: '',
    og_description: '',
    og_image_url: '',
    twitter_card: 'summary_large_image',
    canonical_url: '',
    robots_directive: 'index,follow',
    status: 'draft',
    visibility: 'public',
    word_count: 0,
    reading_time_minutes: 0,
    seo_score: 0,
    slugManuallyEdited: false
  });

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('Never');

  const supabase = getSupabaseClient();

  // Load categories and authors on mount
  useEffect(() => {
    loadCategories();
    loadAuthors();
    if (blogId) {
      loadBlogPost();
    }
  }, [blogId]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    }
  };

  const loadAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setAuthors(data || []);
    } catch (err) {
      console.error('Error loading authors:', err);
      setError('Failed to load authors');
    }
  };

  const loadBlogPost = async () => {
    if (!blogId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          faqs:blog_faqs(id, question, answer, sort_order),
          keywords:page_seo_keywords(id, keyword, is_primary, keyword_density)
        `)
        .eq('id', blogId)
        .single();

      if (error) throw error;

      setFormData({
        ...data,
        slugManuallyEdited: true
      });

      if (data.faqs) setFaqs(data.faqs);
      if (data.keywords) setKeywords(data.keywords);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Error loading blog post:', err);
      setError('Failed to load blog post');
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

  const calculateWordCount = (html) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.trim().split(/\s+/).length;
  };

  const calculateReadingTime = (wordCount) => {
    return Math.ceil(wordCount / 200);
  };

  const calculateSEOScore = (data) => {
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

    if (data.featured_image_alt_text && data.featured_image_alt_text.length > 0) {
      score += 10;
    }

    if (data.word_count >= 300) {
      score += 15;
    } else if (data.word_count >= 150) {
      score += 10;
    }

    if (data.canonical_url) {
      score += 10;
    }

    if (data.og_title && data.og_description) {
      score += 5;
    }

    return Math.min(score, 100);
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      const wordCount = calculateWordCount(formData.content);
      const readingTime = calculateReadingTime(wordCount);
      const seoScore = calculateSEOScore({
        ...formData,
        word_count: wordCount
      });

      const postData = {
        ...formData,
        word_count: wordCount,
        reading_time_minutes: readingTime,
        seo_score: seoScore,
        status: 'draft',
        category_id: formData.category_id || null,
        author_id: formData.author_id || null
      };

      let result;
      if (blogId) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', blogId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setFormData(prev => ({
        ...prev,
        id: result.id,
        word_count: wordCount,
        reading_time_minutes: readingTime,
        seo_score: seoScore
      }));

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString());
      return result;
    } catch (err) {
      console.error('Error saving draft:', err);
      setError('Failed to save draft');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishPost = async () => {
    setLoading(true);
    try {
      const wordCount = calculateWordCount(formData.content);
      const readingTime = calculateReadingTime(wordCount);
      const seoScore = calculateSEOScore({
        ...formData,
        word_count: wordCount
      });

      const postData = {
        ...formData,
        word_count: wordCount,
        reading_time_minutes: readingTime,
        seo_score: seoScore,
        status: 'published',
        published_at: new Date().toISOString(),
        category_id: formData.category_id || null,
        author_id: formData.author_id || null
      };

      let result;
      if (blogId) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', blogId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date().toLocaleTimeString());
      return result;
    } catch (err) {
      console.error('Error publishing post:', err);
      setError('Failed to publish post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addFAQ = async (question, answer) => {
    try {
      if (!formData.id) {
        setError('Save blog post first before adding FAQs');
        return;
      }

      const { data, error } = await supabase
        .from('blog_faqs')
        .insert([{
          blog_id: formData.id,
          question,
          answer,
          sort_order: faqs.length
        }])
        .select()
        .single();

      if (error) throw error;
      setFaqs([...faqs, data]);
      return data;
    } catch (err) {
      console.error('Error adding FAQ:', err);
      setError('Failed to add FAQ');
      throw err;
    }
  };

  const updateFAQ = async (faqId, question, answer) => {
    try {
      const { data, error } = await supabase
        .from('blog_faqs')
        .update({ question, answer })
        .eq('id', faqId)
        .select()
        .single();

      if (error) throw error;
      setFaqs(faqs.map(f => f.id === faqId ? data : f));
      return data;
    } catch (err) {
      console.error('Error updating FAQ:', err);
      setError('Failed to update FAQ');
      throw err;
    }
  };

  const deleteFAQ = async (faqId) => {
    try {
      const { error } = await supabase
        .from('blog_faqs')
        .delete()
        .eq('id', faqId);

      if (error) throw error;
      setFaqs(faqs.filter(f => f.id !== faqId));
      return true;
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      setError('Failed to delete FAQ');
      throw err;
    }
  };

  const addKeywords = async (newKeywords) => {
    try {
      if (!formData.id) {
        setError('Save blog post first before adding keywords');
        return;
      }

      const keywordRecords = newKeywords.map((kw, idx) => ({
        page_id: formData.id,
        keyword: kw.keyword || kw,
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

  return {
    formData,
    categories,
    authors,
    faqs,
    keywords,
    loading,
    error,
    hasUnsavedChanges,
    lastSavedTime,
    updateFormData,
    saveDraft,
    publishPost,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    addKeywords,
    calculateSEOScore
  };
};
