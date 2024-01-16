// import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./Navbar.css";

const NavRoute = ({ url, text }) => {
  return (
    <Link to={`/${url}`}>
      <button className="nav-content">
        <img src={`./images/icons/${url}.png`} alt={`${text} icon`} />
        <p>{text}</p>
      </button>
    </Link>
  );
};

NavRoute.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const Navbar = () => {
  return (
    <div className="nav-container">

      <div className="logo-container justify-center">
        <div className="logo-content">
          <img src="./images/icons/ipl.png" alt="Batsman Icon" />
          <p>IPL Auction 2024</p>
        </div>
      </div>

      <div className="route-container justify-between">
        <NavRoute url="dashboard" text="Dashboard" />
        <NavRoute url="search" text="Search" />
        <NavRoute url="leaderboard" text="Leaderboard" />
        <NavRoute url="calculator" text="Calculator" />
        <NavRoute url="spectate" text="Spectate" />
        <NavRoute url="logout" text="Logout" />
      </div>

    </div>
  );
};

export default Navbar;