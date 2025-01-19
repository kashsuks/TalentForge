import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  const handleRequestSkillClick = () => {
    navigate('/request-skill');
  };

  return (
    <section className="hero">
      <h1 className="hero-slogan">Share.<br /> Ask.<br /> Gain Talent.</h1>
      <div className="hero-button">
        <button className="request-skill-button" onClick={handleRequestSkillClick}>Request a Skill</button>
      </div>
    </section>
  );
}

export default Hero;
