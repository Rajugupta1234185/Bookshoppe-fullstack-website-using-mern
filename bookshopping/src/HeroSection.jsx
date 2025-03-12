import React from 'react';
import './HeroSection.css'; // You can add custom styles in this file

const HeroSection = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Welcome to Book Shoppe</h1>
        <p>Discover your next great read!</p>
        <div className="search-container">
          <input type="text" placeholder="Search for books..." />
          <button>Search</button>
        </div>
        <button className="cta-btn">Shop Now</button>
      </div>
    </div>
  );
};

export default HeroSection;
