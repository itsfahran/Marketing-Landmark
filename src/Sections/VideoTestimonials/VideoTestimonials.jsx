import React, { useEffect, useState } from 'react';
import VideoTestimonialsComponent from '../../Components/Extracted/VideoTestimonials';
import { fetchHomeVideoTestimonials, fetchHomeVideoTestimonialsWithMeta } from '../../lib/supabase-queries';
import { hasDbData } from '../../lib/dataHandler';

// Hardcoded defaults
const DEFAULT_VIDEO_TESTIMONIALS = {
  heading: 'Client Video Testimonials',
  description: 'Watch what our satisfied clients have to say about working with us',
  items: [
    {
      id: '1',
      title: 'Ahmed Ali',
      subtitle: 'CEO, Tech Startup',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    },
    {
      id: '2',
      title: 'Sarah Johnson',
      subtitle: 'Marketing Director',
      video_url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      id: '3',
      title: 'Michael Chen',
      subtitle: 'E-commerce Owner',
      video_url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
      profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    {
      id: '4',
      title: 'Emma Davis',
      subtitle: 'Brand Manager',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    {
      id: '5',
      title: 'James Wilson',
      subtitle: 'Agency Owner',
      video_url: 'https://www.youtube.com/embed/9bZkp7q19f0',
      profile_image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
  ],
};

const VideoTestimonials = () => {
  const [data, setData] = useState(DEFAULT_VIDEO_TESTIMONIALS);

  useEffect(() => {
    loadVideoTestimonials();
  }, []);

  const loadVideoTestimonials = async () => {
    try {
      const [meta, items] = await Promise.all([
        fetchHomeVideoTestimonialsWithMeta(),
        fetchHomeVideoTestimonials(),
      ]);

      // Database-first: if items exist, use them with meta (or defaults); otherwise use all defaults
      if (hasDbData(items)) {
        setData({
          heading: meta?.heading || DEFAULT_VIDEO_TESTIMONIALS.heading,
          description: meta?.description || DEFAULT_VIDEO_TESTIMONIALS.description,
          items: items,
        });
      } else {
        setData(DEFAULT_VIDEO_TESTIMONIALS);
      }
    } catch (error) {
      console.error('Error loading video testimonials, using defaults:', error);
      setData(DEFAULT_VIDEO_TESTIMONIALS);
    }
  };

  return <VideoTestimonialsComponent data={data} />;
};

export default VideoTestimonials;
