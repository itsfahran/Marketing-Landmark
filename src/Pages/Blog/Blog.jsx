import React, { useState, useEffect } from "react";
import "./Blog.css";
import { fetchBlogPosts } from "../../lib/supabase-queries";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

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
              <p>{post.description}</p>
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