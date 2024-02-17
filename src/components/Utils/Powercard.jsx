// import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const powercards = [
  {
    name: "focus fire",
    desc: "Put a Player back in auction"
  },
  {
    name: "double right to match",
    desc: ""
  },
  {
    name: "god's eye",
    desc: ""
  },
  {
    name: "right to match",
    desc: ""
  },
  {
    name: "silent reserve",
    desc: "Secretly reserve two players"
  },
  {
    name: "stealth bid",
    desc: ""
  }
];

const Powercard = ({ name, isUsed }) => {
  const powercard = powercards.find(pc => pc.name.toLowerCase() === name.toLowerCase())

  return (
    <Tooltip title={<p className="text-sm">{powercard.desc}</p>} arrow followCursor>
      <img className="h-[6.6rem] m-2 cursor-pointer"
        src={`/images/powercards/${powercard.name}.png`}
        alt={`${powercard.name} card`}
        style={isUsed ? { 'filter': 'grayscale(100%)' } : {}} />
    </Tooltip>
  );
}

export default Powercard;
