import React, { useState, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import "./Blog.css";
import { fetchBlogPosts, fetchBlogPostBySlug } from "../../lib/supabase-queries";

const Blog = () => {
  const loaderData = useLoaderData() || {};
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(loaderData?.post || null);

  // Check if this is a single post view or blog index
  const isPostDetail = slug || post;

  useEffect(() => {
    if (slug) {
      loadBlogPostBySlug(slug);
    } else if (loaderData?.posts) {
      setPosts(loaderData.posts);
      const uniqueCategories = ["All", ...new Set(loaderData.posts.map((p) => p.category))];
      setCategories(uniqueCategories);
      setLoading(false);
    } else {
      loadBlogPosts();
    }
  }, [slug, loaderData]);

  const loadBlogPostBySlug = async (postSlug) => {
    try {
      const data = await fetchBlogPostBySlug(postSlug);
      if (data) {
        setPost(data);
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const data = await fetchBlogPosts();
      setPosts(data);
      const uniqueCategories = ["All", ...new Set(data.map((p) => p.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Single post detail view
  if (isPostDetail && post) {
    return (
      <main className="blogPage blogDetailPage">
        <article className="blogDetailArticle">
          <div className="blogDetailHeader">
            <a href="/blog" className="backLink">← Back to Blogs</a>
            <h1>{post.title}</h1>
            <div className="blogMeta">
              {post.category && <span className="category">{post.category}</span>}
              {post.published_at && (
                <span className="date">
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
              {post.reading_time_minutes && (
                <span className="readingTime">{post.reading_time_minutes} min read</span>
              )}
            </div>
          </div>

          {post.featured_image_url && (
            <div className="blogDetailImage">
              <img src={post.featured_image_url} alt={post.title} />
            </div>
          )}

          <div className="blogDetailContent">
            {post.excerpt && <p className="excerpt">{post.excerpt}</p>}
            <div className="content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          </div>

          {post.meta_description && (
            <div className="blogMeta">
              <p>{post.meta_description}</p>
            </div>
          )}
        </article>

        <section className="blogNewsletter">
          <h2>Want to Grow Your Website Traffic?</h2>
          <p>
            Read our latest SEO insights and learn how to improve your online presence professionally.
          </p>
          <a href="/contact">Get Free Consultation</a>
        </section>
      </main>
    );
  }

  // Blog index view
  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <main className="blogPage">
      <section className="blogHero">
        <div className="blogHeroContent">
          <span className="blogMiniTitle">Agency Insights</span>
          <h1>Latest SEO, GEO & Digital Marketing Blogs</h1>
          <p>
            Explore practical guides, expert insights, and modern strategies to
            grow your business visibility online.
          </p>
        </div>

        <div className="blogHeroCard">
          <span>Featured</span>
          <h3>Build a Strong Online Presence with Smart SEO</h3>
          <p>
            A professional website needs ranking power, optimized content and
            strong search visibility.
          </p>
        </div>
      </section>

      <section className="blogCategories">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? "activeCategory" : ""}
          >
            {category === "All" ? "All Blogs" : category}
          </button>
        ))}
      </section>

      <section className="blogGrid">
        {loading ? (
          <p>Loading posts...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <article className="blogCard" key={post.id}>
              <div className="blogIcon">{index + 1}</div>
              <span>{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt || post.description}</p>
              <a href={`/blog/${post.slug}`}>Read More →</a>
            </article>
          ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </section>

      <section className="blogNewsletter">
        <h2>Want to Grow Your Website Traffic?</h2>
        <p>
          Read our latest SEO insights and learn how to improve your online
          presence professionally.
        </p>
        <a href="/contact">Get Free Consultation</a>
      </section>
    </main>
  );
};

export default Blog;