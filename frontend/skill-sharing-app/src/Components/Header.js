import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const handleRegisterRedirect = () => {
    window.location.href = 'http://localhost:3100/login';
  };

  const handleRequestSkillClick = () => {
    navigate('/request-skill');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <header className="header">
      <h1 className="header-logo">
        TalentForge
      </h1>
      <nav>
        <ul className="header-nav">
          <li onClick={handleRequestSkillClick}>Request A Skill</li>
          <li onClick={handleDashboardClick}>My Dashboard</li>
          <li onClick={handleProfileClick}>My Profile</li>
        </ul>
      </nav>
      <div className="header-buttons">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={toggleLogin}>Sign Out</button>
        ) : (
          <button className="register-btn" onClick={handleRegisterRedirect}>Register</button>
        )}
      </div>
    </header>
  );
}

export default Header;
