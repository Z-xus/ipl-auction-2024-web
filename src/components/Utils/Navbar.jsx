// import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Popup from "./Popup";
import "./Navbar.css";

const TEAMS = {
  csk: "Chennai Super Kings", dc: "Delhi Capitals", gt: "Gujarat Titans",
  kkr: "Kolkata Knight Riders", lsg: "Lucknow Supergiants", mi: "Mumbai Indians", pbks: "Punjab Kings",
  rcb: "Royal Challengers Bangalore", rr: "Rajasthan Royals", srh: "Sunrisers Hyderabad"
};

const NavButton = ({ url, text, onClick }) => (
  <div className="nav-content cursor-pointer" onClick={onClick}>
    <img className="mr-0.5" src={`/images/icons/${url}.png`} alt={`${text} icon`} />
    <p>{text}</p>
  </div>
);

const SidebarItem = ({ url, logo, abbrv }) => (
  <tr className="text-center align-middle text-3xl font-bold">
    <td>
      <Link to={url}>
        <img className="team-logo" src={logo} alt={`${abbrv} logo`} />
      </Link>
    </td>
    <td>
      <Link to={url}>
        {abbrv.toUpperCase()}
      </Link>
    </td>
  </tr>
);

const Navbar = ({ style = {} }) => {
  const team = localStorage.getItem("team");
  const navigate = useNavigate();

  // Popup Logic
  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => { setShowPopup(true); };
  const handleClosePopup = () => { setShowPopup(false); };

  // Drawer Logic
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleShowDrawer = () => { setDrawerOpen(true); };
  const handleCloseDrawer = () => { setDrawerOpen(false); };

  const handleLogout = () => {
    handleShowPopup();
  };

  const performLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <>
      {showPopup && <Popup message="Are you sure you want to logout?" onCancel={handleClosePopup} onConfirm={performLogout} isOK={false} />}

      <div className="nav-container" style={style}>

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

          <div className="sidebar custom-scrollbar">

            <div className="spectate-content justify-around">
              <img src={`/images/icons/spectate.png`} alt={`Spectate icon`} />
              <p>Spectate Teams</p>
              <button onClick={handleCloseDrawer}>
                <img src={`/images/icons/close.png`} alt={`Close Button`} />
              </button>
            </div>

            <table>
              <tbody onClick={handleCloseDrawer}>
                {Object.entries(TEAMS)
                  .filter(([abbrv]) => abbrv.toUpperCase() !== team)
                  .map(([abbrv]) => (
                    <SidebarItem
                      key={abbrv}
                      url={`/spectate/${abbrv}`}
                      logo={`/images/teamlogo/${abbrv}.png`}
                      abbrv={abbrv}
                    />
                  ))}
              </tbody>
            </table>

          </div>

        </Drawer>
      </div>
    </>
  );
};

export default Navbar;
