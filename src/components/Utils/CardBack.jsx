// import React from 'react';

const CardBack = ({ playerData }) => {
  const { playerName, overall, bat_ppl, bat_mo, bat_dth, bow_ppl, bow_mo, bow_dth } = playerData;

  return (
    <div className='card card-back w-32 h-44 mx-1 p-1.5'>
      <h2 className="player-name">{playerName}</h2>
      <div className=" rounded-lg bg-white text-center shadow-md p-0.5 mx-1">
        <p className="stat-text">Overall: {overall}</p>
      </div>
      <div className="stat-container">
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