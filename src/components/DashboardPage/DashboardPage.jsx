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

      <div className="team-container flex-col px-4">
        <div className="flex flex-col items-center">
          <img className="w-3/5" src={`./images/teamlogo/${dummyTeam.logo}.png`} alt="" />
          <p className="budget-text text-2xl leading-[0]">CURRENT BUDGET</p>
          <p className="budget-text text-[4rem] leading-[6rem]">{dummyTeam.budget}</p>
          <hr className="w-11/12" />
        </div>

        <div className="flex flex-col items-center">
          <p className="powercard-text">POWERCARDS</p>
          <div className="powerupcard-container">
            {dummyTeam.powerups.map((powerup, index) => {
              return <img key={index} className="h-[6.6rem] m-2" src={`./images/powercards/${powerup}.png`} alt={`${powerup} card`} />
            })}
          </div>
        </div>
      </div>

      <div className="team-players-container">Main Content Template</div>
    </div>
  );
};

export default DashboardPage;