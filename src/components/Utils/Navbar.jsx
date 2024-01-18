// import React from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Popup from "./Popup";
import "./Navbar.css";

const NavButton = ({ url, text, onClick }) => (
  <div className="nav-content cursor-pointer" onClick={onClick}>
    <img className="mr-0.5" src={`/images/icons/${url}.png`} alt={`${text} icon`} />
    <p>{text}</p>
  </div>
);

NavButton.propTypes = {
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
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
  const navigate = useNavigate()

  // TODO
  // Grey out Leaderboard Button until allowed
  // Redirect to Dashboard if own team is selected in spectate

  // Popup Logic
  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => { setShowPopup(true) };
  const handleClosePopup = () => { setShowPopup(false) };

  // Drawer Logic
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleShowDrawer = () => { setDrawerOpen(true) };
  const handleCloseDrawer = () => { setDrawerOpen(false) };

  const handleLogout = () => {
    handleShowPopup();
  };

  const performLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      {showPopup && <Popup message="Are you sure you want to logout?" onCancel={handleClosePopup} onConfirm={performLogout} />}

      <div className="nav-container">

        {/* IPL Logo */}
        <div className="logo-container justify-center">
          <div className="logo-content">
            <img src="/images/icons/ipl.png" alt="Batsman Icon" />
            <p>IPL Auction 2024</p>
          </div>
        </div>

        {/* All Nav Buttons */}
        <div className="route-container justify-between">
          <NavButton url="dashboard" text="Dashboard" onClick={() => navigate('/dashboard')} />
          <NavButton url="search" text="Search" onClick={() => navigate('/search')} />
          <NavButton url="leaderboard" text="Leaderboard" onClick={() => navigate('/leaderboard')} />
          <NavButton url="calculator" text="Calculator" onClick={() => navigate('/calculator')} />
          <NavButton url="spectate" text="Spectate" onClick={handleShowDrawer} />
          <NavButton url="logout" text="Logout" onClick={() => handleLogout()} />
        </div>

        {/* Sidebar */}
        <Drawer sx={{
          '.MuiDrawer-paper': { backgroundColor: 'transparent', },
          '& .MuiBackdrop-root': { backdropFilter: 'blur(5px)', },
        }}
          anchor="left" open={isDrawerOpen} onClose={handleCloseDrawer}>

          <div className="sidebar">

            <div className="spectate-content justify-around">
              <img src={`/images/icons/spectate.png`} alt={`Spectate icon`} />
              <p>Spectate Teams</p>
              <button onClick={handleCloseDrawer}>
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
    </>
  );
};

export default Navbar;