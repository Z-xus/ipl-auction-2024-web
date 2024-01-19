// import React from 'react'

const CardFront = ({ playerData }) => {
  return (
    <>
      <h1 className="text-center py-2">{playerData.playerName}</h1>
      <div className="flex flex-row justify-evenly">
        <div className="flex flex-col text-center">
          <span>Bat</span>
          <span>{playerData.bat_ppl}</span>
          <span>{playerData.bat_mo}</span>
          <span>{playerData.bat_dth}</span>
        </div>
        <div className="flex flex-col text-center">
          <span>Bowl</span>
          <span>{playerData.bow_ppl}</span>
          <span>{playerData.bow_mo}</span>
          <span>{playerData.bow_dth}</span>
        </div>
      </div>
    </>
  )
}

export default CardFront;