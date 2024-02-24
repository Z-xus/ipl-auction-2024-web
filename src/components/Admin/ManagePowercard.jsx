import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css'; 

const ManagePowercardForm = () => {
  const [teamName, setTeamName] = useState('');
  const [slot, setSlot] = useState('');
  const [selectedPowercard, setSelectedPowercard] = useState('');
  const [action,setAction] = useState('')

  const teamOptions = [
    'CSK','DC','GT','KKR','LSG','MI','PBKS','RCB','RR','SRH'
  ];

  const powercardOptions = ["focus fire", "god's eye", "right to match", "double right to match", "silent reserve", "stealth bid"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      const response = await axios.post('http://localhost:3000/adminManagePowercard', {
        teamName,
        slot,
        powercard : selectedPowercard ,
        action
      })

      console.log(response.data);

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
      
      <h2>Manage Powercard Form</h2>
      <form onSubmit={handleSubmit} className='form'>
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
          Slot:
          <input type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>
        
        
        <br />
        <label>
          Powercards:
          <select value={selectedPowercard} onChange={(e) => setSelectedPowercard(e.target.value)}>
            <option value="">Select Powercard</option>
            {powercardOptions.map((powercard, index) => (
              <option key={index} value={powercard}>
                {powercard}
              </option>
            ))}
          </select>
        </label>
        <br />

        <label>
  Action:
  <div>
    <label>
      <input
        type="radio"
        value="add"
        checked={action === 'add'}
        onChange={() => setAction('add')}
      />
      Add
    </label>
    <label>
      <input
        type="radio"
        value="use"
        checked={action === 'use'}
        onChange={() => setAction('use')}
      />
      Use
    </label>
  </div>
</label>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ManagePowercardForm;
