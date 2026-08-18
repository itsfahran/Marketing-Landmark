import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaArrowLeft, FaPlus, FaTrash, FaEye, FaCheck, FaExclamationCircle,
  FaFileImage, FaBold, FaItalic, FaUnderline, FaLink,
  FaList, FaListOl, FaQuoteLeft, FaCode, FaUndo,
  FaRedo, FaAlignLeft, FaAlignCenter, FaAlignRight, FaClock,
  FaUser, FaTag, FaFolderOpen, FaTimes, FaGripVertical, FaCheckCircle,
  FaTimesCircle, FaExclamationTriangle, FaSearch, FaSave, FaFolder
} from 'react-icons/fa';
import { useBlogEditor } from '../../hooks/useBlogEditor';
import SEOScoreDisplay from '../../Components/Admin/SEOScoreDisplay';
import ToastNotification from '../../Components/Admin/ToastNotification';
import DataSelector from '../../Components/Admin/DataSelector';
import KeywordManager from '../../Components/Admin/KeywordManager';
import ContentStats from '../../Components/Admin/ContentStats';
import './BlogEditor.css';

// ============================================================================
// COMPONENTS
// ============================================================================

const PageHeader = ({ onBack, onSaveDraft, onPreview, onPublish, hasUnsavedChanges, lastSavedTime }) => (
  <div className="blog-editor-header">
    <div className="header-left">
      <button className="btn-back" onClick={onBack}>
        <FaArrowLeft /> Back
      </button>
      <div className="header-titles">
        <h1>Create New Blog Post</h1>
        <p>Create and optimize your blog post for search engines and social sharing.</p>
      </div>
    </div>
    <div className="header-right">
      <div className="autosave-indicator">
        {hasUnsavedChanges ? (
          <span className="unsaved">●  Unsaved changes</span>
        ) : (
          <span className="saved">✓ {lastSavedTime}</span>
        )}
      </div>
      <button className="btn btn-ghost" onClick={onSaveDraft}>
        <FaSave /> Save Draft
      </button>
      <button className="btn btn-secondary" onClick={onPreview}>
        <FaEye /> Preview
      </button>
      <button className="btn btn-primary" onClick={onPublish}>
        Publish
      </button>
    </div>
  </div>
);

const BasicInformation = ({ data, onChange }) => {
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    onChange('title', title);

    // Auto-generate slug if not manually edited
    if (!data.slugManuallyEdited) {
      onChange('slug', generateSlug(title));
    }
  };

  const handleSlugChange = (e) => {
    onChange('slug', e.target.value);
    onChange('slugManuallyEdited', true);
  };

  return (
    <section className="editor-section">
      <h2 className="section-title">Basic Information</h2>

      <div className="form-group">
        <label>Blog Title *</label>
        <div className="input-with-counter">
          <input
            type="text"
            value={data.title}
            onChange={handleTitleChange}
            placeholder="Best Bridal Dresses in Pakistan: Complete 2026 Guide"
            maxLength={100}
            required
          />
          <span className="char-counter">{(data.title || '').length}/100</span>
        </div>
        {(data.title || '').length < 30 && (data.title || '').length > 0 && (
          <small className="warning">Title should be at least 30 characters</small>
        )}
      </div>

      <div className="form-group">
        <label>URL Slug *</label>
        <div className="slug-input-wrapper">
          <span className="slug-prefix">{typeof window !== 'undefined' ? window.location.origin : 'example.com'}/blog/</span>
          <input
            type="text"
            value={data.slug}
            onChange={handleSlugChange}
            placeholder="best-bridal-dresses-pakistan"
            required
          />
        </div>
        <small className="helper-text">
          Final URL: {typeof window !== 'undefined' ? window.location.origin : 'example.com'}/blog/{data.slug || 'url-slug-here'}
        </small>
      </div>

      <div className="form-group">
        <label>Excerpt / Short Description</label>
        <div className="input-with-counter">
          <textarea
            value={data.excerpt}
            onChange={(e) => onChange('excerpt', e.target.value)}
            placeholder="Discover the latest bridal dress styles, fabrics, colors and trends in Pakistan."
            maxLength={160}
            rows={3}
          />
          <span className="char-counter">{(data.excerpt || '').length}/160</span>
        </div>
        <small className="helper-text">Displayed in search results and social sharing (120-160 characters recommended)</small>
      </div>
    </section>
  );
};

const FeaturedImageUploader = ({ imageData, onChange, onImageUpload }) => {
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageSelection(files[0]);
    }
  };

  const handleImageSelection = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange('featured_image_url', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="editor-section">
      <h2 className="section-title">Featured Image</h2>

      {!imageData.featured_image_url ? (
        <div
          ref={dropZoneRef}
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FaFileImage className="drop-zone-icon" />
          <p>Drag and drop your featured image here</p>
          <p className="or-text">or</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageSelection(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <small className="helper-text">
            Recommended: 1200 x 630 pixels | JPG, PNG (Max 5MB)
          </small>
        </div>
      ) : (
        <div className="image-preview-section">
          <img src={imageData.featured_image_url} alt="Featured" className="featured-image-preview" />

          <div className="image-form-group">
            <label>Alt Text (Important for SEO & Accessibility) *</label>
            <input
              type="text"
              value={imageData.featured_image_alt_text}
              onChange={(e) => onChange('featured_image_alt_text', e.target.value)}
              placeholder="Red Pakistani bridal dress with traditional embroidery"
              maxLength={125}
            />
            <small className="helper-text">
              Describe what's in the image (125 chars max). Example: "Red Pakistani bridal dress with traditional embroidery"
            </small>
          </div>

          <div className="image-form-group">
            <label>Image Title</label>
            <input
              type="text"
              value={imageData.featured_image_title}
              onChange={(e) => onChange('featured_image_title', e.target.value)}
              placeholder="Brief title of the image"
            />
          </div>

          <div className="image-form-group">
            <label>Caption</label>
            <textarea
              value={imageData.featured_image_caption}
              onChange={(e) => onChange('featured_image_caption', e.target.value)}
              placeholder="Optional caption displayed below image"
              rows={2}
            />
          </div>

          <div className="image-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace Image
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onChange('featured_image_url', '');
                onChange('featured_image_alt_text', '');
                onChange('featured_image_title', '');
                onChange('featured_image_caption', '');
              }}
            >
              Remove Image
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const RichTextEditor = ({ content, onChange, onContentStatsChange }) => {
  const editorRef = useRef(null);
  const [selectedText, setSelectedText] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize editor content once
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = content || '';
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Calculate stats
    const safeContent = content || '';
    const words = safeContent.split(/\s+/).filter(w => w.length > 0).length;
    const chars = safeContent.length;
    const readingTime = Math.ceil(words / 200);
    onContentStatsChange({ words, chars, readingTime });
  }, [content, onContentStatsChange]);

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHeading = (level) => {
    const tag = `h${level}`;
    document.execCommand('insertHTML', false, `<${tag}>Heading text here</${tag}>`);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) applyFormat('createLink', url);
  };

  return (
    <section className="editor-section">
      <h2 className="section-title">Blog Content</h2>

      <div className="toolbar">
        <div className="toolbar-group">
          <button title="Bold" onClick={() => applyFormat('bold')} className="toolbar-btn">
            <FaBold />
          </button>
          <button title="Italic" onClick={() => applyFormat('italic')} className="toolbar-btn">
            <FaItalic />
          </button>
          <button title="Underline" onClick={() => applyFormat('underline')} className="toolbar-btn">
            <FaUnderline />
          </button>
        </div>

        <div className="toolbar-group">
          <button title="H2" onClick={() => insertHeading(2)} className="toolbar-btn">
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>H2</span>
          </button>
          <button title="H3" onClick={() => insertHeading(3)} className="toolbar-btn">
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>H3</span>
          </button>
        </div>

        <div className="toolbar-group">
          <button title="Bullet List" onClick={() => applyFormat('insertUnorderedList')} className="toolbar-btn">
            <FaList />
          </button>
          <button title="Numbered List" onClick={() => applyFormat('insertOrderedList')} className="toolbar-btn">
            <FaListOl />
          </button>
        </div>

        <div className="toolbar-group">
          <button title="Quote" onClick={() => applyFormat('formatBlock', 'blockquote')} className="toolbar-btn">
            <FaQuoteLeft />
          </button>
          <button title="Code Block" onClick={() => applyFormat('formatBlock', 'pre')} className="toolbar-btn">
            <FaCode />
          </button>
        </div>

        <div className="toolbar-group">
          <button title="Link" onClick={insertLink} className="toolbar-btn">
            <FaLink />
          </button>
        </div>

        <div className="toolbar-group">
          <button title="Undo" onClick={() => applyFormat('undo')} className="toolbar-btn">
            <FaUndo />
          </button>
          <button title="Redo" onClick={() => applyFormat('redo')} className="toolbar-btn">
            <FaRedo />
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="rich-text-editor"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />

      <div className="editor-stats">
        <span>💬 Words: {Math.round((content || '').split(/\s+/).filter(w => w).length)}</span>
        <span>📝 Characters: {(content || '').length}</span>
        <span>⏱️ Reading time: {Math.ceil((content || '').split(/\s+/).filter(w => w).length / 200)} min</span>
      </div>
    </section>
  );
};

const CategorySelector = ({ selectedCategory, categories = [], onChange, onCreateCategory }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = (categories || []).filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="sidebar-card">
      <h3>Category</h3>
      {selectedCategory ? (
        <div className="selected-item">
          <span>{selectedCategory}</span>
          <button onClick={() => onChange(null)} className="remove-btn">
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="selector-wrapper">
          <input
            type="text"
            placeholder="Search or create category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            className="selector-input"
          />
          {searchOpen && (
            <div className="dropdown">
              {filteredCategories.map(cat => (
                <button
                  key={cat}
                  className="dropdown-item"
                  onClick={() => {
                    onChange(cat);
                    setSearchTerm('');
                    setSearchOpen(false);
                  }}
                >
                  {cat}
                </button>
              ))}
              {searchTerm && !filteredCategories.includes(searchTerm) && (
                <button
                  className="dropdown-item create-new"
                  onClick={() => {
                    onCreateCategory(searchTerm);
                    onChange(searchTerm);
                    setSearchTerm('');
                    setSearchOpen(false);
                  }}
                >
                  <FaPlus /> Create "{searchTerm}"
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const TagSelector = ({ selectedTags = [], allTags = [], onChange, onCreateTag }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTags = (allTags || []).filter(tag =>
    !(selectedTags || []).includes(tag) && tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTag = (tag) => {
    onChange([...(selectedTags || []), tag]);
    setSearchTerm('');
  };

  const removeTag = (tag) => {
    onChange((selectedTags || []).filter(t => t !== tag));
  };

  return (
    <section className="sidebar-card">
      <h3>Tags</h3>
      <div className="tags-wrapper">
        {(selectedTags || []).map(tag => (
          <span key={tag} className="tag-chip">
            {tag}
            <button onClick={() => removeTag(tag)} className="remove-btn">
              <FaTimes />
            </button>
          </span>
        ))}
      </div>
      <div className="selector-wrapper">
        <input
          type="text"
          placeholder="Add tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchOpen(true)}
          className="selector-input"
        />
        {searchOpen && (
          <div className="dropdown">
            {(filteredTags || []).map(tag => (
              <button
                key={tag}
                className="dropdown-item"
                onClick={() => addTag(tag)}
              >
                {tag}
              </button>
            ))}
            {searchTerm && !(filteredTags || []).includes(searchTerm) && (
              <button
                className="dropdown-item create-new"
                onClick={() => {
                  addTag(searchTerm);
                  onCreateTag(searchTerm);
                }}
              >
                <FaPlus /> Create "{searchTerm}"
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const AuthorSelector = ({ selectedAuthor, authors = [], onChange }) => (
  <section className="sidebar-card">
    <h3>Author</h3>
    <select
      value={selectedAuthor || ''}
      onChange={(e) => onChange(e.target.value)}
      className="selector-select"
    >
      <option value="">Select Author</option>
      {(authors || []).map(author => (
        <option key={author.id} value={author.id}>
          {author.name} - {author.role}
        </option>
      ))}
    </select>
  </section>
);

const SEOSettings = ({ formData, onChange, title, excerpt, slug }) => {
  // Auto-generate meta title from blog title
  useEffect(() => {
    if (!formData.slugManuallyEdited && title && !formData.meta_title) {
      onChange('meta_title', `${title} | Pakistan Guide`);
    }
  }, [title]);

  // Auto-generate meta description from excerpt
  useEffect(() => {
    if (excerpt && !formData.meta_description) {
      onChange('meta_description', excerpt.substring(0, 160));
    }
  }, [excerpt]);

  return (
    <section className="editor-section">
      <h2 className="section-title">🔍 SEO Settings</h2>

      <div className="form-group">
        <label>Focus Keyword</label>
        <input
          type="text"
          value={formData.focus_keyword || ''}
          onChange={(e) => onChange('focus_keyword', e.target.value)}
          placeholder="bridal dresses pakistan"
        />
        <small className="helper-text">The main keyword you want to rank for</small>
      </div>

      <div className="form-group">
        <label>Meta Title *</label>
        <div className="input-with-counter">
          <input
            type="text"
            value={formData.meta_title || ''}
            onChange={(e) => onChange('meta_title', e.target.value)}
            maxLength={60}
          />
          <span className={`char-counter ${(formData.meta_title || '').length < 30 ? 'warning' : (formData.meta_title || '').length > 60 ? 'error' : ''}`}>
            {(formData.meta_title || '').length}/60
          </span>
        </div>
        <small className="helper-text">30-60 characters recommended</small>
      </div>

      <div className="form-group">
        <label>Meta Description *</label>
        <div className="input-with-counter">
          <textarea
            value={formData.meta_description || ''}
            onChange={(e) => onChange('meta_description', e.target.value)}
            maxLength={160}
            rows={3}
          />
          <span className={`char-counter ${(formData.meta_description || '').length < 120 ? 'warning' : (formData.meta_description || '').length > 160 ? 'error' : ''}`}>
            {(formData.meta_description || '').length}/160
          </span>
        </div>
        <small className="helper-text">120-160 characters recommended (appears in search results)</small>
      </div>

      <div className="form-group">
        <label>Canonical URL</label>
        <input
          type="url"
          value={formData.canonical_url || ''}
          onChange={(e) => onChange('canonical_url', e.target.value)}
          placeholder={`https://example.com/blog/${slug}`}
        />
        <small className="helper-text">Leave empty to auto-generate</small>
      </div>

      <div className="form-group">
        <label>Robots Directive</label>
        <select
          value={formData.robots_directive || 'index,follow'}
          onChange={(e) => onChange('robots_directive', e.target.value)}
          className="selector-select"
        >
          <option value="index,follow">Index, Follow</option>
          <option value="noindex,follow">No Index, Follow</option>
          <option value="index,nofollow">Index, No Follow</option>
          <option value="noindex,nofollow">No Index, No Follow</option>
        </select>
      </div>
    </section>
  );
};

const GoogleSearchPreview = ({ metaTitle, metaDescription, slug }) => {
  const truncateDescription = (text, maxLength = 160) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <section className="preview-section">
      <h3>Google Search Preview</h3>
      <div className="google-preview">
        <div className="preview-url">example.com › blog › {slug || 'your-slug-here'}</div>
        <div className="preview-title">{metaTitle || 'Your blog title will appear here'}</div>
        <div className="preview-description">
          {truncateDescription(metaDescription) || 'Your meta description will appear here...'}
        </div>
      </div>
    </section>
  );
};

const SocialSharing = ({ formData, onChange }) => (
  <section className="editor-section">
    <h2 className="section-title">📱 Social Sharing</h2>

    <div className="form-group">
      <label>OG Title (Open Graph)</label>
      <input
        type="text"
        value={formData.og_title || ''}
        onChange={(e) => onChange('og_title', e.target.value)}
        maxLength={60}
        placeholder="Best Bridal Dresses in Pakistan"
      />
      <small className="helper-text">Appears when shared on social media</small>
    </div>

    <div className="form-group">
      <label>OG Description</label>
      <textarea
        value={formData.og_description || ''}
        onChange={(e) => onChange('og_description', e.target.value)}
        maxLength={160}
        rows={3}
        placeholder="Explore latest bridal dress styles and designs..."
      />
      <small className="helper-text">Max 160 characters</small>
    </div>

    <div className="form-group">
      <label>OG Image URL</label>
      <input
        type="url"
        value={formData.og_image_url || ''}
        onChange={(e) => onChange('og_image_url', e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
      <small className="helper-text">Recommended: 1200 x 630 pixels</small>
    </div>

    <div className="form-group">
      <label>Twitter Card</label>
      <select
        value={formData.twitter_card || 'summary_large_image'}
        onChange={(e) => onChange('twitter_card', e.target.value)}
        className="selector-select"
      >
        <option value="summary">Summary</option>
        <option value="summary_large_image">Summary Large Image</option>
      </select>
    </div>

    <div className="social-preview-card">
      <h4>Social Media Preview</h4>
      <div className="preview-social">
        <div className="preview-header">Facebook & LinkedIn</div>
        <div className="preview-og-title">{formData.og_title || 'Your OG title'}</div>
        <div className="preview-og-description">{formData.og_description || 'Your description'}</div>
      </div>
    </div>
  </section>
);

const FAQBuilder = ({ faqs = [], onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const safeFaqs = faqs || [];

  const addFAQ = () => {
    onChange([...safeFaqs, { question: '', answer: '' }]);
  };

  const updateFAQ = (index, field, value) => {
    const updated = [...safeFaqs];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeFAQ = (index) => {
    onChange(safeFaqs.filter((_, i) => i !== index));
  };

  const moveFAQ = (index, direction) => {
    const updated = [...safeFaqs];
    if (direction === 'up' && index > 0) {
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setExpandedIndex(index - 1);
    } else if (direction === 'down' && index < safeFaqs.length - 1) {
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setExpandedIndex(index + 1);
    }
    onChange(updated);
  };

  return (
    <section className="editor-section">
      <div className="section-header-with-button">
        <h2 className="section-title">FAQ</h2>
        <button type="button" className="btn btn-secondary" onClick={addFAQ}>
          <FaPlus /> Add FAQ
        </button>
      </div>

      {(safeFaqs || []).map((faq, index) => (
        <div key={index} className="faq-item">
          <div
            className="faq-header"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <span className="faq-number">Q{index + 1}</span>
            <div className="faq-preview">
              <p className="faq-q">{faq.question || 'Add question...'}</p>
            </div>
            <span className={`faq-toggle ${expandedIndex === index ? 'open' : ''}`}>▼</span>
          </div>

          {expandedIndex === index && (
            <div className="faq-content">
              <textarea
                value={faq.question}
                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                placeholder="What are the most popular bridal dress styles?"
                rows={2}
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                placeholder="Answer to the question..."
                rows={4}
              />
              <div className="faq-actions">
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => moveFAQ(index, 'up')}
                  disabled={index === 0}
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => moveFAQ(index, 'down')}
                  disabled={index === safeFaqs.length - 1}
                  title="Move down"
                >
                  ▼
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFAQ(index)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

const SEOAnalysis = ({ data = {}, focusKeyword }) => {
  const safeData = data || {};
  const checks = [
    {
      title: 'Focus keyword added',
      passed: !!focusKeyword,
      icon: '🔑'
    },
    {
      title: 'Keyword appears in title',
      passed: focusKeyword && (safeData.title || '').toLowerCase().includes(focusKeyword.toLowerCase()),
      icon: '📄'
    },
    {
      title: 'Meta description is optimal length',
      passed: (safeData.meta_description || '').length >= 120 && (safeData.meta_description || '').length <= 160,
      icon: '📝'
    },
    {
      title: 'Featured image has alt text',
      passed: !!(safeData.featured_image_alt_text),
      icon: '🖼️'
    },
    {
      title: 'Content has heading structure',
      passed: (safeData.content || '').includes('<h2>') || (safeData.content || '').includes('<h3>'),
      icon: '📊'
    },
    {
      title: 'Adequate content length',
      passed: (safeData.content || '').split(/\s+/).length >= 300,
      icon: '📚'
    }
  ];

  const passedCount = checks.filter(c => c.passed).length;
  const totalCount = checks.length;
  const seoStatus = passedCount >= 5 ? 'Good' : passedCount >= 3 ? 'Okay' : 'Needs Improvement';
  const statusColor = passedCount >= 5 ? '#10b981' : passedCount >= 3 ? '#f59e0b' : '#ef4444';

  return (
    <section className="editor-section">
      <h2 className="section-title">📊 SEO Analysis</h2>

      <div className="seo-status-card" style={{ borderLeftColor: statusColor }}>
        <h4 style={{ color: statusColor }}>SEO Status: {seoStatus}</h4>
        <div className="status-progress">
          <div className="progress-bar" style={{ width: `${(passedCount / totalCount) * 100}%`, backgroundColor: statusColor }}></div>
        </div>
        <p className="status-text">{passedCount} of {totalCount} checks passed</p>
      </div>

      <div className="seo-checklist">
        {(checks || []).map((check, index) => (
          <div key={index} className={`check-item ${check.passed ? 'passed' : 'pending'}`}>
            <span className="check-icon">{check.passed ? '✓' : '○'}</span>
            <span className="check-title">{check.icon} {check.title}</span>
          </div>
        ))}
      </div>

      {passedCount < 6 && (
        <div className="seo-tips">
          <h4>💡 Tips to Improve SEO:</h4>
          <ul>
            {!focusKeyword && <li>Add a focus keyword to optimize for search</li>}
            {focusKeyword && !(safeData.title || '').toLowerCase().includes(focusKeyword.toLowerCase()) && <li>Include your focus keyword in the blog title</li>}
            {!((safeData.meta_description || '').length >= 120) && <li>Write a meta description of at least 120 characters</li>}
            {!safeData.featured_image_alt_text && <li>Add alt text to your featured image for accessibility and SEO</li>}
            {!(safeData.content || '').includes('<h2>') && <li>Use heading hierarchy (H2, H3) for better structure</li>}
            {(safeData.content || '').split(/\s+/).length < 300 && <li>Aim for at least 300 words of content</li>}
          </ul>
        </div>
      )}
    </section>
  );
};

const PublishingCard = ({ publishData, onChange }) => (
  <section className="sidebar-card">
    <h3>Publishing</h3>

    <div className="publish-field">
      <label>Status</label>
      <select
        value={publishData.status}
        onChange={(e) => onChange('status', e.target.value)}
        className="selector-select"
      >
        <option value="draft">Draft</option>
        <option value="review">Review</option>
        <option value="scheduled">Scheduled</option>
        <option value="published">Published</option>
      </select>
    </div>

    <div className="publish-field">
      <label>Visibility</label>
      <select
        value={publishData.visibility}
        onChange={(e) => onChange('visibility', e.target.value)}
        className="selector-select"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
    </div>

    {publishData.status === 'scheduled' && (
      <>
        <div className="publish-field">
          <label>Publish Date</label>
          <input
            type="date"
            value={publishData.publishDate}
            onChange={(e) => onChange('publishDate', e.target.value)}
          />
        </div>

        <div className="publish-field">
          <label>Publish Time</label>
          <input
            type="time"
            value={publishData.publishTime}
            onChange={(e) => onChange('publishTime', e.target.value)}
          />
        </div>

        <div className="publish-field">
          <label>Timezone</label>
          <select
            value={publishData.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
            className="selector-select"
          >
            <option value="UTC">UTC</option>
            <option value="PST">Pacific Time</option>
            <option value="EST">Eastern Time</option>
            <option value="IST">India Standard Time</option>
            <option value="PKT">Pakistan Standard Time</option>
          </select>
        </div>
      </>
    )}

    <div className="publish-actions">
      <button type="button" className="btn btn-ghost" style={{ width: '100%' }}>
        Save Draft
      </button>
      {publishData.status === 'scheduled' && (
        <button type="button" className="btn btn-secondary" style={{ width: '100%' }}>
          Schedule
        </button>
      )}
      <button type="button" className="btn btn-primary" style={{ width: '100%' }}>
        {publishData.status === 'published' ? 'Update' : 'Publish'}
      </button>
    </div>
  </section>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlogEditor() {
  // Use Supabase blog editor hook
  const {
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
  } = useBlogEditor();

  const [contentStats, setContentStats] = useState({ words: 0, chars: 0, readingTime: 0 });
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (field, value) => {
    updateFormData(field, value);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Leave anyway?')) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft();
      showNotification('Draft saved successfully!', 'success');
    } catch (err) {
      showNotification('Failed to save draft: ' + err.message, 'error');
    }
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.content) {
      showNotification('Please fill in required fields (title and content)', 'error');
      return;
    }
    try {
      await publishPost();
      showNotification('Blog post published successfully!', 'success');
      setTimeout(() => window.history.back(), 1500);
    } catch (err) {
      showNotification('Failed to publish: ' + err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="blog-editor-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-editor-container">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-editor-container">
      {notification && (
        <div className={`notification notification-${notification.type}`} style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '15px 20px',
          borderRadius: '4px',
          backgroundColor: notification.type === 'success' ? '#4CAF50' : notification.type === 'error' ? '#f44336' : '#2196F3',
          color: 'white',
          zIndex: 9999,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {notification.message}
        </div>
      )}
      <PageHeader
        onBack={handleBack}
        onSaveDraft={handleSaveDraft}
        onPreview={() => setShowPreview(true)}
        onPublish={handlePublish}
        hasUnsavedChanges={hasUnsavedChanges}
        lastSavedTime={lastSavedTime}
      />

      <div className="blog-editor-layout">
        <main className="blog-editor-main">
          <BasicInformation data={formData} onChange={handleChange} />
          <FeaturedImageUploader imageData={formData} onChange={updateFormData} />
          <RichTextEditor
            content={formData.content}
            onChange={(content) => handleChange('content', content)}
            onContentStatsChange={setContentStats}
          />
          <SEOSettings
            formData={formData}
            onChange={handleChange}
            title={formData.title}
            excerpt={formData.excerpt}
            slug={formData.slug}
          />
          <GoogleSearchPreview
            metaTitle={formData.meta_title}
            metaDescription={formData.meta_description}
            slug={formData.slug}
          />
          <SocialSharing
            formData={formData}
            onChange={handleChange}
          />
          <FAQBuilder
            faqs={formData.faqs}
            onChange={(faqs) => handleChange('faqs', faqs)}
          />
          {/* SEO Score Display */}
          <SEOScoreDisplay
            score={formData.seo_score || 0}
            data={formData}
          />

          {/* Content Statistics */}
          <ContentStats
            wordCount={formData.word_count || 0}
            readingTime={formData.reading_time_minutes || 0}
            viewCount={formData.view_count || 0}
            status={formData.status}
            publishedAt={formData.published_at}
            lastUpdated={formData.updated_at}
          />

          {/* Legacy SEO Analysis */}
          <SEOAnalysis
            data={formData}
            focusKeyword={formData.focus_keyword}
            seoScore={formData.seo_score}
          />
        </main>

        <aside className="blog-editor-sidebar">
          <DataSelector
            label="Category"
            value={formData.category_id}
            onChange={(catId) => handleChange('category_id', catId)}
            options={categories}
            loading={loading}
            placeholder="Select a category..."
            icon={FaFolder}
            hint="Choose a blog category"
          />

          <TagSelector
            selectedTags={formData.tags}
            allTags={formData.tags || []}
            onChange={(tags) => handleChange('tags', tags)}
            onCreateTag={(newTag) => {
              showNotification('Tag created successfully', 'success');
            }}
          />

          <KeywordManager
            keywords={keywords}
            onAdd={(keyword) => addKeywords([{keyword}])}
            onDelete={(id) => deleteFAQ(id)}
            onTogglePrimary={(id, isPrimary) => updateFAQ(id, {is_primary: isPrimary})}
          />

          <DataSelector
            label="Author"
            value={formData.author_id}
            onChange={(authorId) => handleChange('author_id', authorId)}
            options={authors}
            loading={loading}
            placeholder="Select an author..."
            icon={FaUser}
            hint="Choose blog author"
          />

          <PublishingCard
            publishData={{
              status: formData.publishStatus,
              visibility: formData.visibility,
              publishDate: formData.publishDate,
              publishTime: formData.publishTime,
              timezone: formData.timezone
            }}
            onChange={(field, value) => {
              if (field === 'status') handleChange('publishStatus', value);
              else if (field === 'visibility') handleChange('visibility', value);
              else handleChange(field, value);
            }}
          />
        </aside>
      </div>

      {showPreview && formData && (
        <BlogPreview
          data={{
            title: formData.title || '',
            excerpt: formData.excerpt || '',
            featured_image_url: formData.featured_image_url || '',
            featured_image_alt_text: formData.featured_image_alt_text || '',
            content: formData.content || '',
            meta_title: formData.meta_title || '',
            meta_description: formData.meta_description || '',
            og_title: formData.og_title || '',
            og_description: formData.og_description || '',
            word_count: formData.word_count || 0,
            seo_score: formData.seo_score || 0,
            faqs: formData.faqs || [],
            category: categories?.find(c => c.id === formData.category_id)?.name,
            author: authors?.find(a => a.id === formData.author_id)?.name
          }}
          contentStats={contentStats}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

// Blog Preview Component
function BlogPreview({ data, contentStats, onClose }) {
  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="preview-close" onClick={onClose}>✕</button>

        <div className="preview-tabs">
          <button className="preview-tab active">Desktop</button>
          <button className="preview-tab">Mobile</button>
        </div>

        <div className="preview-content">
          {data.featuredImage && (
            <img src={data.featuredImage} alt={data.altText} className="preview-featured-image" />
          )}

          <div className="preview-meta">
            {data.category && <span className="preview-category">{data.category}</span>}
            <span className="preview-reading-time">📖 {contentStats.readingTime} min read</span>
          </div>

          <h1 className="preview-title">{data.title}</h1>

          {data.author && (
            <div className="preview-author">
              <span>By Author • Published {new Date().toLocaleDateString()}</span>
            </div>
          )}

          <div className="preview-body" dangerouslySetInnerHTML={{ __html: data.content }} />

          {data.faqs && data.faqs.length > 0 && (
            <section className="preview-faq">
              <h2>Frequently Asked Questions</h2>
              {data.faqs.map((faq, i) => (
                <details key={i} className="faq-item-preview">
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
