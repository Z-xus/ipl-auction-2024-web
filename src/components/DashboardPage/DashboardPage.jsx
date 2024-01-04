// import React from "react";
import { Navbar } from "../Utils";
import "./DashboardPage.css"

const dummyTeam = {
  name: "MI",
  logo: "mi",
  budget: "90 CR",
  powerups: ["focusfire", "double right to match", "god's eye", "right to match", "silent reserve", "stealth bid"]
}

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      <nav className="col-span-2">
        <Navbar />
      </nav>

      <div className="team-container">
        <div className="team-info">
          <img className="team-logo" src={`./images/teamlogo/${dummyTeam.logo}.png`} alt="" />
          <p className="budget-text">CURRENT BUDGET</p>
          <p className="budget-price">{dummyTeam.budget}</p>
          <hr className="w-11/12" />
        </div>

        <div className="powerup-container">
          <p className="powercard-text">POWERCARDS</p>
          <div className="powerupcard-container">
            {dummyTeam.powerups.map((powerup, index) => {
              return <img key={index} className="powerupcard" src={`./images/powercards/${powerup}.png`} alt={`${powerup} card`} />
            })}
          </div>
        </div>
      </div>

      <div className="team-players-container">Main Content Template</div>
    </div>
  );
};

export default DashboardPage;