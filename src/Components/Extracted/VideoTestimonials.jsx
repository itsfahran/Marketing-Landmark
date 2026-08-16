import React, { useState, useEffect } from 'react';
import './VideoTestimonials.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const VideoTestimonials = ({ data }) => {
  const heading = data?.heading || 'Client Reviews';
  const description = data?.description || '';
  const videos = data?.items || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (videos.length === 0) return;

    const videosPerView = 3;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + videosPerView >= videos.length ? 0 : prev + videosPerView));
    }, 5000);

    return () => clearInterval(interval);
  }, [videos.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  if (videos.length === 0) {
    return (
      <section className="video-testimonials">
        <div className="video-testimonials-container">
          <h2>No video testimonials yet</h2>
        </div>
      </section>
    );
  }

  const videosPerView = 3;
  const visibleVideos = [];
  for (let i = 0; i < videosPerView; i++) {
    visibleVideos.push(videos[(currentIndex + i) % videos.length]);
  }

  return (
    <section className="video-testimonials">
      <div className="video-testimonials-container">
        {heading && <h2 className="video-testimonials-heading">{heading}</h2>}
        {description && <p className="video-testimonials-description">{description}</p>}

        <div className="video-testimonials-wrapper">
          <button className="video-nav-btn prev" onClick={goToPrevious}>
            <FaChevronLeft />
          </button>

          <div className="video-testimonials-grid">
            {visibleVideos.map((video, idx) => (
              <div key={idx} className="video-testimonial-card">
                <div className="video-wrapper">
                  {video.video_url ? (
                    <iframe
                      src={video.video_url}
                      title={video.title}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  ) : (
                    <div className="video-placeholder">No video</div>
                  )}
                </div>

                <div className="video-info">
                  {video.profile_image_url && (
                    <img src={video.profile_image_url} alt={video.title} className="profile-img" />
                  )}
                  <div className="video-text">
                    <h3>{video.title}</h3>
                    <p>{video.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="video-nav-btn next" onClick={goToNext}>
            <FaChevronRight />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="video-dots">
          {videos.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonials;
