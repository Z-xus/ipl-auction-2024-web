// import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const Input = ({ type, name, placeholder, label, onChange }) => (
  <div className="input-group">
    <label className="input-label" htmlFor={label}>{name}</label>
    <input className="input-field" type={type} id={label} placeholder={placeholder} onChange={onChange} />
  </div>
);

const LoginPage = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [slot, setSlot] = useState();
  const navigate = useNavigate();

  const submitForm = async () => {
    const userDetails = {
      username: username,
      password: password,
      slot: slot
    };

    const { data } = await axios.post(`${import.meta.env.VITE_SERVERURL}/login`, userDetails, { headers: { "Content-Type": "application/json" } });

    if (data.user) {
      localStorage.clear();
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("team", data.user.teamName);
      localStorage.setItem("slot", data.user.slot);
      localStorage.setItem("budget", data.user.budget);
      localStorage.setItem("players", JSON.stringify(data.user.players));
      localStorage.setItem("powercards", JSON.stringify(data.user.powercards));
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="main">
      {/* Logo Images */}
      <img className='absolute h-32 top-0 right-0' src='/images/logo/oculus.png' />
      <img className='absolute h-28 top-16 left-105 z-10' src='/images/logo/iplauction.png' />

      {/* Login Form */}
      <div className="login-container">
        <h1 className="login-title"> Login </h1>
        <div className="login-form">
          <Input type="text" name="Username" placeholder="Username" label="username" onChange={e => setUsername(e.target.value)} />
          <Input type="password" name="Password" placeholder="Password" label="password" onChange={e => setPassword(e.target.value)} />
          <Input type="text" name="Slot" placeholder="Slot No." label="slot" onChange={e => setSlot(e.target.value)} />
          <button type="submit" className="login-button" onClick={submitForm}> Login </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
