// import React from 'react'

/**
 * Adds appropriate suffix to Number 
 * @param {number} number - The input number to be formatted.
 * @returns {string} The formatted string with suffix.
 */
function numberConvert(number) {
  let num = Math.abs(Number(number));
  let sign = Math.sign(num);

  if (num >= 1e7)
    return `${sign * (num / 1e7).toFixed(1)} CR`;
  else if (num >= 1e5)
    return `${sign * (num / 1e5).toFixed(1)} L`;
  else if (num >= 1e3)
    return `${sign * (num / 1e3).toFixed(1)} K`;
  else
    return (sign * num).toString();
}

const CardFront = ({ playerData }) => {
  return (
    <div className='card card-front w-32 h-44 m-1 p-1.5 relative overflow-hidden'>
      <img src={`/images/players/${playerData.playerName}.png`} alt={playerData.playerName} className='absolute w-full h-full object-cover' />

      <div className="flex flex-col items-stretch justify-end h-full absolute bottom-0 left-0 right-0 z-10 p-2">
        <h1 className="player-name text-left">{playerData.playerName}</h1>

        <div className="front-stat-container">
          <div>
            <p className="text-[.7rem] leading-none stat-text"> PRICE </p>
            <p className="text-lg leading-tight stat-text"> {numberConvert(playerData.basePrice)} </p>
          </div>

          <img src={`/images/flag/${playerData.flag}.png`} alt="Country Flag" className="rounded-full h-9 w-9" />
        </div>
      </div>

    </div>
  );
};

export default CardFront;