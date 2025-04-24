import React, { useState, useEffect } from "react";
import './Dashboard.css';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  // ✅ Manually list your image file names here
  const images = [
    "/sliding image/i1.png",
    "/sliding image/i2.png",
    "/sliding image/i3.png"
  
  ];

  // Image change effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const signin=()=>{
    navigate('/login');
  }

  return (
    <div className="home-maincontent">
      <div className="firstdiv">
        <div className="home-logo">
          <img src="/logo.gif.gif" alt="Logo Animation" className="logo-gif" />
        </div>

        <div className="home-searchbar">
          <input type="text" placeholder="What do you want to Read?" id="search" />
        </div>

        <div style={{ display: "flex" }}>
          <div className="cart"><p>Cart</p></div>
          <div className="signin" onClick={signin}><p>SignIn</p></div>
        </div>
      </div>

      <div className="sliddingtemplate">
        <img
          src={images[current]}
          alt="Slide"
          className="sliding-image"
        />
      </div>

      <div className="genres">
        <div className="genreheading"><p>Genres</p></div>
        <div className="genrename">
          <div className="fiction"> </div>
          <div className="business"> </div>
          <div className="biography"> </div>
          <div className="kid"> </div>
          <div className="romantic"> </div>
         
        </div>
      </div>

      <div className="category-fiction">
        <div className="fictionheading"><p>Fiction</p></div></div>
        
      <div className="category-business">
        <div className="businessheading"><p>Business</p></div></div>
        
      <div className="category-biography">
        <div className="biographyheading"><p>Biography</p></div></div>

      <div className="category-kid">
        <div className="kidheading"><p>Kid</p></div></div>

      <div className="category-romantic">
        <div className="romanticheading"><p>Romantic</p></div></div>

    </div>
  );
};

export default Dashboard;
