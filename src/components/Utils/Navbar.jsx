// import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import "./Navbar.css";

const NavRoute = ({ url, text }) => {
  return (
    <Link to={`/${url}`}>
      <div className="nav-content">
        <img className="mr-0.5" src={`/images/icons/${url}.png`} alt={`${text} icon`} />
        <p>{text}</p>
      </div>
    </Link>
  );
};

NavRoute.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const SidebarItem = ({ url, logo, abbrv }) => (
  <Link to={url} className="spectate-content justify-center" key={abbrv}>
    <img className="team-logo" src={logo} alt={`${abbrv} logo`} />
    <p>{abbrv.toUpperCase()}</p>
  </Link>
);

SidebarItem.propTypes = {
  url: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  abbrv: PropTypes.string.isRequired,
};

const Navbar = () => {
  const teams = {
    csk: "Chennai Super Kings", dc: "Delhi Capitals", gt: "Gujarat Titans",
    kkr: "Kolkata Knight Riders", lsg: "Lucknow Supergiants", mi: "Mumbai Indians", pbks: "Punjab Kings",
    rcb: "Royal Challengers Bangalore", rr: "Rajasthan Royals", srh: "Sunrisers Hyderabad"
  };
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // TODO
  // Add Animations
  // Grey out Leaderboard Button until allowed
  // Redirect to Dashboard if own team is selected in spectate

  return (
    <div className="nav-container">

      <div className="logo-container justify-center">
        <div className="logo-content">
          <img src="/images/icons/ipl.png" alt="Batsman Icon" />
          <p>IPL Auction 2024</p>
        </div>
      </div>

      {/* All Nav Buttons */}
      <div className="route-container justify-between">
        <NavRoute url="dashboard" text="Dashboard" />
        <NavRoute url="search" text="Search" />
        <NavRoute url="leaderboard" text="Leaderboard" />
        <NavRoute url="calculator" text="Calculator" />
        <button className="nav-content" onClick={() => setDrawerOpen(true)}>
          <img className="mr-0.5" src={`/images/icons/spectate.png`} alt={`Spectate icon`} />
          <p>Spectate</p>
        </button>
        <NavRoute url="logout" text="Logout" />
      </div>

      {/* Sidebar */}
      <Drawer sx={{
        '.MuiDrawer-paper': { backgroundColor: 'transparent', },
        '& .MuiBackdrop-root': { backdropFilter: 'blur(5px)', },
      }}
        anchor="left" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>

        <div className="sidebar">

          <div className="spectate-content justify-around">
            <img src={`/images/icons/spectate.png`} alt={`Spectate icon`} />
            <p>Spectate Teams</p>
            <button onClick={() => setDrawerOpen(false)}>
              <img src={`/images/icons/close.png`} alt={`Close Button`} />
            </button>
          </div>

          {Object.entries(teams).map(([abbrv]) => (
            <SidebarItem
              key={abbrv}
              url={`/spectate/${abbrv}`}
              logo={`/images/teamlogo/${abbrv}.png`}
              abbrv={abbrv}
            />
          ))}

        </div>

      </Drawer>
    </div>
  );
};

export default Navbar;