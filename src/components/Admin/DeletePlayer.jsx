import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const DeletePlayer = () => {
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [slot, setSlot] = useState('');
  const [response, setResponse] = useState(false);

  const teamOptions = [
    'CSK', 'DC', 'GT', 'KKR', 'LSG', 'MI', 'PBKS', 'RCB', 'RR', 'SRH'
  ];

  const timeOut = () => {
    setTimeout(() => {
      setResponse(false)
    }, 2000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${SERVERURL}/adminDeletePlayer`, {
        playerName,
        teamName,
        slot: Number(slot)
      })

      console.log(`Submitted response : ${response.data}`);
      setSlot('')
      setTeamName('')
      setPlayerName('')
      setResponse(true)
      timeOut()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-player-container" style={{ marginBottom: "2rem" }}>

      <h2 className='h2'>Delete Player Form</h2>
      {response && <h2 className='my-4'> Success </h2>}
      <form onSubmit={handleSubmit} className="form">
        <label className='label'>
          Team Name:
          <select className='select' value={teamName} onChange={(e) => setTeamName(e.target.value)} required>
            <option className='option' value="">Select Team</option>
            {teamOptions.map((team, index) => (
              <option key={index} value={team} className='option'>
                {team}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className='label'>
          Player Name:
          <input className='input' type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </label>
        <br />
        <label className='label'>
          Slot:
          <input className='input' type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>
        <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default DeletePlayer;
