// import React from 'react';

const CardBack = ({ playerData }) => {
  const { playerName, overall, bat_ppl, bat_mo, bat_dth, bow_ppl, bow_mo, bow_dth } = playerData;
  const cardType = playerData.gender == "legendary" ? 'legend' : playerData.Elite == "E" ? 'elite' : playerData.gender == "female" ? "women" : '';

  return (
    <div className={`card card-back w-32 h-44 m-1 p-1.5 ${cardType}`}>
      <p className="text-ellipsis player-name rounded-md my-1">{playerName}</p>
      <div className="rounded-md bg-white text-center shadow-md p-0.5 mx-1">
        <p className="stat-text">Overall: {overall}</p>
      </div>
      <div className="back-stat-container rounded-md">
        <div className="flex flex-col text-center">
          <p className="stat-text">BAT</p>
          <p className="stat-text">{bat_ppl} PPL</p>
          <p className="stat-text">{bat_mo} MO</p>
          <p className="stat-text">{bat_dth} DTH</p>
        </div>
        <div className="flex flex-col text-center">
          <p className="stat-text">BOWL</p>
          <p className="stat-text">{bow_ppl} PPL</p>
          <p className="stat-text">{bow_mo} MO</p>
          <p className="stat-text">{bow_dth} DTH</p>
        </div>
      </div>
    </div>
  );
};

export default CardBack;
