import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import downloadIcon from './assets/download_button_2x.png'; // Update the path to your resized image

const NavBar = () => {
  const handleDownload = () => {
    window.location.href = `http://5.161.233.167:5000/download/backup`;
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><NavLink to="/" activeClassName="active" exact>Home</NavLink></li>
        <li><NavLink to="/chemicals" activeClassName="active">Chemicals</NavLink></li>
        <li><NavLink to="/glassware" activeClassName="active">Glassware</NavLink></li>
        <li><NavLink to="/equipment" activeClassName="active">Equipment</NavLink></li>
      </ul>
      <button className="download-button" onClick={handleDownload}>
        <img
          src={downloadIcon}
          alt="Download"
          className="download-icon"
          title="Download Backup"
        />
      </button>
    </nav>
  );
};

export default NavBar;
