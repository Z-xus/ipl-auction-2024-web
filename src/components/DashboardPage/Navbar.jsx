// import React from "react";
import "./Navbar.css"

const Navbar = () => {
  return (
  <div className="nav-container">

      <div className="logo-container">
        <div className="logo-text">IPL Auction 2024</div>
      </div>

      <div className="route-container">
        <div className="nav-text">Dashboard</div>
        <div className="nav-text">Search</div>
        <div className="nav-text">Leaderboard</div>
        <div className="nav-text">Calculator</div>
        <div className="nav-text">Spectate</div>
        <div className="nav-text">Logout</div>
      </div>

    </div>
  );
};

export default Navbar;