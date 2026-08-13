import React, { useEffect, useState } from 'react';
import './VideoTestimonials.css';
import { fetchVideoTestimonials } from '../../lib/supabase-queries';

const VideoTestimonials = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideoTestimonials();
  }, []);

  const loadVideoTestimonials = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Video testimonials fetch timeout')), 10000)
      );
      const data = await Promise.race([fetchVideoTestimonials(), timeoutPromise]);
      setVideos(data || []);
    } catch (error) {
      console.error('Error loading video testimonials:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    // Handle various YouTube URL formats
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('/embed/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  if (loading) {
    return (
      <section className="video-testimonials-section">
        <h2>Loading video testimonials...</h2>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="video-testimonials-section">
      <div className="video-testimonials-container">
        <div className="video-testimonials-header">
          <h2>Video Testimonials</h2>
          <p>See what our clients say about working with us</p>
        </div>

        <div className="video-grid">
          {videos.map((video, index) => (
            <div key={video.id || index} className="video-card">
              <div className="video-wrapper">
                <iframe
                  width="100%"
                  height="315"
                  src={getYouTubeEmbedUrl(video.video_url)}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="video-content">
                {video.profile_image_url && (
                  <img src={video.profile_image_url} alt={video.title} className="profile-image" />
                )}

                <div className="video-info">
                  <h3>{video.title}</h3>
                  {video.subtitle && <p className="subtitle">{video.subtitle}</p>}
                  {video.caption && <p className="caption">{video.caption}</p>}
                  {video.link && (
                    <a href={video.link} target="_blank" rel="noopener noreferrer" className="video-link">
                      View Profile →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
