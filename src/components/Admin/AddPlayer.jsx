
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 


const AddPlayer = () => {
  const [teamName, setTeamName] = useState('');
  const [playerName, setplayerName] = useState('');
  const [slot, setSlot] = useState('');
  const [price, setPrice] = useState('');

  const teamOptions = [
    'CSK','DC','GT','KKR','LSG','MI','PBKS','RCB','RR','SRH'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request using Axios
      const response = await axios.post('http://localhost:3000/adminAddPlayer', {
        playerName,
        teamName,
        slot,
        price,
      });

      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="add-player-container">

      <Link to='/admin'>
        <button className="home-button">
          Home
        </button>
      </Link>
      
      <h2>Add Player Form</h2>

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
          Player Name : 
          <input type="text" value={playerName} onChange={(e) => setplayerName(e.target.value)} required />
        </label>
        <br />
        <label>
          Slot : 
          <input type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>
        <br />
        <label>
          Price : 
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AddPlayer;
