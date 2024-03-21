// import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const TEAMS = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PBKS", "RCB", "RR", "SRH"];
const POWERCARDS = ["focus fire", "god's eye", "right to match", "double right to match", "silent reserve", "stealth bid"];

const DeletePowercardForm = () => {
  const [adminUsername, setAdminUsername] = useState(localStorage.getItem('username') || '');
  const [teamName, setTeamName] = useState('');
  const [slot, setSlot] = useState('');
  const [selectedPowercard, setSelectedPowercard] = useState('');
  const [msgDisplay, setMsgDisplay] = useState(false);
  const [resMsg, setResMsg] = useState('');

  const timeOut = () => {
    setTimeout(() => {
      setMsgDisplay(false);
    }, 10000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVERURL}/adminUsePowercard`, {
        adminUsername,
        teamName,
        slot: Number(slot),
        powercard: selectedPowercard,
      });

      setResMsg(response.data.message);
      setMsgDisplay(true);
      setTeamName('');
      setSelectedPowercard('');
      timeOut();
    } catch (err) {
      console.error('Error submitting form: ', err);
    }
  };

  return (
    <>
      {msgDisplay && <h2 className='response-text'> {resMsg} </h2>}
      <div className="admin-form-container">
        <h2 className='h2'>Delete Powercard</h2>

        <form onSubmit={handleSubmit} className='form'>
          <label className='label'>
            Team Name:
            <select className='select' value={teamName} onChange={(e) => setTeamName(e.target.value)} required>
              <option className='option' value="">Select Team</option>
              {TEAMS.map((team, index) => (
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
              {POWERCARDS.map((powercard, index) => (
                <option key={index} value={powercard} className='option'>
                  {powercard}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </>
  );
};

export default DeletePowercardForm;
