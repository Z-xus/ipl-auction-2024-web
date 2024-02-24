import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 

const DeletePlayer = () => {
  const [teamName, setTeamName] = useState('');
  const [playerName, setplayerName] = useState('');
  const [slot, setSlot] = useState('');

  const teamOptions = [
    'CSK','DC','GT','KKR','LSG','MI','PBKS','RCB','RR','SRH'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      const response = await axios.post('http://localhost:3000/adminDeletePlayer',{
        teamName,
        playerName,
        slot
      })

      console.log(`Submitted response : ${response.data}`);
    }catch (error)
    {
      console.log(error);
    }
  };

  return (
    <div className="add-player-container">

      <Link to='/admin'>
        <button className="home-button">
          Home
        </button>
      </Link>
      
      <h2>Delete Player Form</h2>

      <form onSubmit={handleSubmit} className="form">
      <label>
          Team Name:
          <select value={teamName} onChange={(e) => setTeamName(e.target.value)} required>
            <option value="">Select Team</option>
            {teamOptions.map((team, index) => (
              <option key={index} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>

        <br />
        <label>
          Player Name:
          <input type="text" value={playerName} onChange={(e) => setplayerName(e.target.value)} />
        </label>
        <br />
        <label>
          Slot:
          <input type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>
        <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default DeletePlayer;
