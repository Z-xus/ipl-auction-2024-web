// import React from "react";
import PropTypes from 'prop-types';
import { Navbar, Powercard } from "../Utils";
import "./DashboardPage.css"

const dummyTeam = {
  "username": "user1",
  "password": "password1",
  "slot": 1,
  "teamName": "MI",
  "budget": 987656789,
  "score": 78,
  "players": [],
  "powercards": [
    { name: "focus fire", isUsed: false },
    { name: "double right to match", isUsed: true },
    { name: "god's eye", isUsed: true },
    { name: "right to match", isUsed: true },
    { name: "silent reserve", isUsed: true },
    { name: "stealth bid", isUsed: false }
  ]
}

/**
 * Adds appropriate suffix to Number 
 * @param {number} number - The input number to be formatted.
 * @returns {string} The formatted string with suffix.
 */
function numberConvert(number) {
  let num = Number(number);
  let sign = Math.sign(num);
  num = Math.abs(num);

  if (num >= 1e7)
    return sign * (num / 1e7).toFixed(1) + ' CR';
  else if (num >= 1e5)
    return sign * (num / 1e5).toFixed(1) + ' L';
  else if (num >= 1e3)
    return sign * (num / 1e3).toFixed(1) + ' K';
  else
    return (sign * num).toString();
}

const DashboardPage = ({ teamDetails }) => {
  // TODOs:
  // Implement Functionality

  if (!teamDetails)
    teamDetails = dummyTeam;

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="col-span-2">
        <Navbar />
      </nav>

      {/* Team Data */}
      <div className="team-container flex-col px-4">
        {/* Budget Info */}
        <div className="flex flex-col items-center">
          <img className="w-3/5" src={`/images/teamlogo/${teamDetails.teamName.toLowerCase()}.png`} alt="" />
          <p className="budget-text text-2xl leading-[0]">CURRENT BUDGET</p>
          <p className="budget-text text-[4rem] leading-[6rem]">{numberConvert(teamDetails.budget)}</p>
          <hr className="w-11/12" />
        </div>

        {/* Powercard Info */}
        <div className="flex flex-col items-center">
          <p className="powercard-text">POWERCARDS</p>
          <div className="powerupcard-container">
            {teamDetails.powercards.map((pc, index) => (<Powercard key={index} name={pc.name} isUsed={pc.isUsed} />))}
          </div>
        </div>
      </div>

      {/* Team Players */}
      <div className="team-players-container">Main Content Template</div>
    </div>
  );
};

DashboardPage.propTypes = {
  teamDetails: PropTypes.object
};

export default DashboardPage;