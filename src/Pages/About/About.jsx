import React, { useEffect, useState } from "react";
import "./About.css";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.png";
import Testimonials from "../../Sections/Testimonials/Testimonials";
import Brand from "../../Sections/Brand/Brand";
import { fetchAboutPageHero, fetchAboutPageMarquee, fetchAboutPageMissionValues, fetchAboutPageTeam, fetchAboutPageAchievements } from "../../lib/supabase-queries";

const About = () => {
  const [heroData, setHeroData] = useState(null);
  const [marqueeItems, setMarqueeItems] = useState([]);
  const [missionData, setMissionData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [hero, marquee, mission, team, achievements] = await Promise.all([
        fetchAboutPageHero(),
        fetchAboutPageMarquee(),
        fetchAboutPageMissionValues(),
        fetchAboutPageTeam(),
        fetchAboutPageAchievements(),
      ]);
      setHeroData(hero);
      setMarqueeItems(marquee);
      setMissionData(mission);
      setTeamData(team);
      setAchievementsData(achievements);
    } catch (error) {
      console.error("Error loading about page:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <section className="about-page">
        <div className="about-container">
          <div className="about-content">
            <span className="about-badge">{heroData?.badge || "About"}</span>
            <h1>{heroData?.heading || "About"}</h1>
            <p>{heroData?.description}</p>

            <div className="about-stats">
              {heroData?.stat_1_value && (
                <div className="stat-box">
                  <h3>{heroData.stat_1_value}</h3>
                  <span>{heroData.stat_1_label}</span>
                </div>
              )}
              {heroData?.stat_2_value && (
                <div className="stat-box">
                  <h3>{heroData.stat_2_value}</h3>
                  <span>{heroData.stat_2_label}</span>
                </div>
              )}
              {heroData?.stat_3_value && (
                <div className="stat-box">
                  <h3>{heroData.stat_3_value}</h3>
                  <span>{heroData.stat_3_label}</span>
                </div>
              )}
            </div>

            <div className="about-buttons">
              {heroData?.button_1_text && (
                <Link to={heroData.button_1_link || "/"} className="about-btn primary-btn">
                  {heroData.button_1_text} <span>→</span>
                </Link>
              )}
              {heroData?.button_2_text && (
                <a href={heroData.button_2_link || "#"} className="about-btn outline-btn">
                  {heroData.button_2_text} <span>→</span>
                </a>
              )}
            </div>
          </div>

          <div className="about-image-area">
            <div className="about-image-bg"></div>
            <img src={heroData?.image_url || hero} alt="Farhan Ali SEO Expert" />
          </div>
        </div>

        <div className="about-marquee">
          <div className="marquee-track">
            {marqueeItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>{item.text}</span>
                <b>*</b>
              </React.Fragment>
            ))}
          </div>
        </div>

        <section className="mission-section">
          <div className="mission-container">
            <div className="mission-heading">
              <span>What We Stand For</span>
              <h2>My Mission And Vision</h2>
            </div>

            <div className="mission-grid">
              {missionData.map((item) => (
                <div key={item.id} className="mission-card">
                  <div className="mission-icon">
                    <img src={item.icon_url} alt={item.type} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Brand />

        <section className="team-section">
          <div className="team-container">
            <div className="team-heading">
              <span>☛ Team</span>
              <h2>Digital Marketing Experts Team</h2>
            </div>

            <div className="team-grid">
              {teamData.map((member) => (
                <div key={member.id} className="team-card">
                  <div className="team-image">
                    <img src={member.image_url || hero} alt={member.name} />
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="achievements-section">
          <div className="achievements-heading">
            <span>☛ Achievements</span>
          </div>

          <div className="achievements-wrapper">
            {achievementsData.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-icon">
                  <span>{achievement.icon}</span>
                </div>
                <h3>{achievement.value}</h3>
                <p>{achievement.label}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
      <Testimonials />
    </>
  );
};

export default About;