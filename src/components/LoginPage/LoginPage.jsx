// import React from 'react';
import PropTypes from 'prop-types';
import './LoginPage.css';

const Input = ({ type, name, placeholder, label }) => (
  <div className="input-group">
    <label className="input-label" htmlFor={label}>{name}</label>
    <input className="input-field" type={type} id={label} placeholder={placeholder} />
  </div>
);

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

const LoginPage = () => (
  <div className="main">
    {/* Logo Images */}
    <img className='absolute h-32 top-0 right-0' src='/images/logo/oculus.png' />
    <img className='absolute h-28 top-16 left-105 z-10' src='/images/logo/iplauction.png' />

    {/* Login Form */}
    <div className="login-container">
      <h1 className="login-title"> Login </h1>
      <form className="login-form">
        <Input type="text" name="Username" placeholder="Username" label="username" />
        <Input type="password" name="Password" placeholder="Password" label="password" />
        <Input type="text" name="Slot" placeholder="Slot No." label="slot" />
        <button type="submit" className="login-button"> Login </button>
      </form>
    </div>
  </div>
);

export default LoginPage;