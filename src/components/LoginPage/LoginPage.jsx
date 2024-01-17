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
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form">
        <Input type="text" name="Username" placeholder="Username" label="username" />
        <Input type="password" name="Password" placeholder="Password" label="password" />
        <Input type="text" name="Slot" placeholder="Slot No." label="slot" />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  </div>
);

export default LoginPage;

/*
   <div className="box">
      <div className="group">
        <div className="text-wrapper">Login</div>
        <div className="overlap">
          <div className="div">Sign in</div>
        </div>
        <div className="group-2">
          <div className="overlap-group">
            <div className="text-wrapper-2">username@gmail.com</div>
          </div>
          <div className="text-wrapper-3">Email</div>
          <div className="overlap-group-2">
            <div className="text-wrapper-4">Password</div>
            <img className="clarity-eye-hide" alt="Clarity eye hide" src="clarity-eye-hide-line.svg" />
          </div>
          <div className="text-wrapper-5">Password</div>
          <div className="text-wrapper-6">Forgot Password?</div>
        </div>
      </div>
    </div>
*/