import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const ManagePowercardForm = () => {
  const [teamName, setTeamName] = useState('');
  const [slot, setSlot] = useState('');
  const [selectedPowercard, setSelectedPowercard] = useState('');
  const [action, setAction] = useState('');
  const [response, setResponse] = useState(false);

  const teamOptions = [
    'CSK', 'DC', 'GT', 'KKR', 'LSG', 'MI', 'PBKS', 'RCB', 'RR', 'SRH'
  ];

  const powercardOptions = ["focus fire", "god's eye", "right to match", "double right to match", "silent reserve", "stealth bid"];

  const timeOut = () => {
    setTimeout(() => {
      setResponse(false)
    }, 2000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response
      if (action === 'add') {
        response = await axios.post(`${SERVERURL}/adminAddPowercard`, {
          teamName,
          slot,
          powercard: selectedPowercard,
        });
      }
      else {
        response = await axios.post(`${SERVERURL}/adminUsePowercard`, {
          teamName,
          slot,
          powercard: selectedPowercard,
        });
      }
      console.log(response.data);
      setAction('');
      setSelectedPowercard('');
      setSlot('');
      setTeamName('');
      setResponse(true);
      timeOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add-player-container" style={{ marginBottom: "2rem" }}>
      <h2 className='h2'>Manage Powercard Form</h2>

      {response && <h2 className='my-4'> Success </h2>}

      <form onSubmit={handleSubmit} className='form'>
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
          Slot:
          <input className='input' type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>
        <br />
        <label className='label'>
          Powercards:
          <select className='select' value={selectedPowercard} onChange={(e) => setSelectedPowercard(e.target.value)}>
            <option className='option' value="">Select Powercard</option>
            {powercardOptions.map((powercard, index) => (
              <option key={index} value={powercard} className='option'>
                {powercard}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label className='label radio-label'>
          Action:
          <div className="radio-group">
            <label>
              <input
                className="radio-input"
                type="radio"
                value="add"
                checked={action === 'add'}
                onChange={() => setAction('add')}
              />
              <span className="radio-text">Add</span>
            </label>
            <label>
              <input
                className="radio-input"
                type="radio"
                value="use"
                checked={action === 'use'}
                onChange={() => setAction('use')}
              />
              <span className="radio-text">Use</span>
            </label>
          </div>
        </label>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ManagePowercardForm;
