import React, { useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const SERVERURL = import.meta.env.VITE_SERVERURL;

const TEAMS = ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PBKS", "RCB", "RR", "SRH"];

const AddPlayerForm = () => {
  const [adminUsername, setAdminUsername] = useState(localStorage.getItem('username') || '');
  const [teamName, setTeamName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [slot, setSlot] = useState('');
  const [price, setPrice] = useState('');
  const [msgDisplay, setMsgDisplay] = useState(false);
  const [resMsg, setResMsg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputActive, setInputActive] = useState(false); // Track input focus state

  const Playernames = ["Shahrukh Khan", "Rajat Patidar", "Mayank Agarwal", "Rahul Tripathi", "Jonny Bairstow", "Shimron Hetmyer", "David Miller", "Ruturaj Gaikwad", "Yashasvi Jaiswal", "Devon Conway", "Shivam dube", "Aiden Markram", "Ajinkya Rahane", "Manish Pandey", "Rinku Singh", "Ayush Badoni", "Nitish Rana", "Prithvi Shaw", "Tim David", "Shreyas Iyer", "Daryl Mitchell", "Shubman Gill", "David Warner", "Kane Williamson", "Faf du Plessis", "Suryakumar Yadav", "Shikhar Dhawan", "Virat Kohli", "Rohit Sharma", "Rahul Chahar", "Mohsin Khan", "Umesh Yadav", "Varun Chakravarthy", "Deepak Chahar", "Sandeep Sharma", "Tim Southee", "Lungi Ngidi", "T Natarajan", "Mohammed Siraj", "Ravichandran Ashwin", "Khaleel Ahmad", "Mohit Sharma", "Matheesha Pathirana", "Harshal Patel", "Ravi Bishnoi", "Umran Malik", "Mahesh theekshana", "Noor Ahmed", "Pat Cummins", "Ishant Sharma", "Lockie Ferguson", "Mitchell Starc", "Mukesh Kumar", "Arshdeep Singh", "Mark Wood", "Wanindu Hasaranga", "Piyush Chawla", "Avesh Khan", "Gerald Coetzee", "Anrich Nortje", "Mohammed Shami", "Rashid Khan", "Jasprit Bumrah", "Trent Boult", "Kagiso Rabada", "Bhuvneshwar Kumar", "Kuldeep Yadav", "Yuzvendra Chahal", "Sikandar Raza", "Vijay Shankar", "Venkatesh Iyer", "Rahul Tewatia", "Shardul Thakur", "Washington Sundar", "Axar Patel", "Deepak Hooda", "Abdul Samad", "Rachin Ravindra", "Marco Jansen", "Krunal Pandya", "Cameron Green", "Rovman Powell", "Moeen Ali", "Mitchell Santner", "Andre Russell", "Travis Head", "Sunil Narine", "Sam Curran", "Liam Livingstone", "Hardik Pandya", "Ravindra Jadeja", "Glenn Maxwell", "Nicholas Pooran", "Rishabh Pant", "Ishan Kishan", "Sanju Samson", "MS Dhoni", "Quinton de Kock", "Jos Buttler", "KL Rahul", "Dewald Brevis", "Abhishek Sharma", "Devdutt Paddikal", "Nathan Ellis", "Joshua Little", "Dilshan Madushanka", "Tilak Verma", "Sameer Rizvi", "Jitesh Sharma", "Heinrich Klaasen", "Sachin Tendulkar", "Chris Gayle", "Ab De Villiers", "Kierron Pollard", "Zaheer Khan", "Harbhajan Singh", "Lasith Malinga", "Yuvraj Singh", "Suresh Raina", "Virender Sehwag", "Shafali Verma", "Jemimah Rodrigues", "Smriti Mandhana", "Meg Lanning", "Sophie Ecclestone", "Deepti Sharma", "Hayley Mathews", "Natalie Sciver Brunt", "Tahlia McGrath", "Harmanpreet Kaur"];

  const timeOut = () => {
    setTimeout(() => {
      setMsgDisplay(false);
    }, 10000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVERURL}/adminAddPlayer`, {
        adminUsername,
        playerName,
        teamName,
        slot: Number(slot),
        price: Number(price),
      });

      setResMsg(response.data.message);
      setMsgDisplay(true);
      setPlayerName('');
      setTeamName('');
      setPrice('');
      timeOut();
    } catch (err) {
      console.error('Error submitting form: ', err);
    }
  };

  const handlePlayerNameChange = (e) => {
    const value = e.target.value;
    setPlayerName(value);
    // Filter player names based on input value
    const filteredSuggestions = Playernames.filter((player) =>
      player.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (value) => {
    setPlayerName(value);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    setInputActive(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setInputActive(false);
    }, 100);
  };

  return (
    <>
      {msgDisplay && <h2 className='response-text'> {resMsg} </h2>}
      <div className="admin-form-container">
        <h2 className='h2'>Add Player</h2>

        <form onSubmit={handleSubmit} className="form">
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
            Player Name :
            <input
              className='input'
              type="text"
              value={playerName}
              onChange={handlePlayerNameChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
            {/* Display suggestions only when input is active */}
            {/* {inputActive && ( */}
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
            {/* )} */}
          </label>
          <br />
          <label className='label'>
            Slot :
            <input className='input' type="text" value={slot} onChange={(e) => setSlot(e.target.value)} />
          </label>
          <br />
          <label className='label'>
            Price :
            <input className='input' type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <br />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </>
  );
};

export default AddPlayerForm;
