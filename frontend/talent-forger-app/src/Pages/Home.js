// src/components/Home.js
import React from 'react';
import Hero from "../Components/Hero.js";
import './Home.css';

// Import images
import webDevelopmentImage from "../assets/Tutoring.jpg";
import legalWorkImage from "../assets/Cooking.jpg";
import healthWellnessImage from "../assets/Web Development.png";

function Home() {
  return (
    <div className="home">
      <div className="content-container">
        <Hero />
        <div className="image-gallery">
            <img src={webDevelopmentImage} alt="Tutoring Classes" className="home-image" />
            <img src={legalWorkImage} alt="Cooking Classes" className="home-image small-image" />
            <img src={healthWellnessImage} alt="Web Development" className="home-image small-image"/>
        </div>
      </div>
    </div>
  );
}

export default Home;
