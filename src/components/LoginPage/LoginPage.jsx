import React from 'react';
import "./LoginPage.css"
const LoginPage = () => {
  return (
    <div className="main flex justify-center items-center h-screen">
      <div className="login flex flex-col justify-center items-center h-96 w-96 rounded-3xl bg-white bg-opacity-50 border-black p-4">
        <h1 className="font-bold text-black text-3xl mb-10">Login</h1>
        <form className="flex flex-col items-center">
          <input type="text" placeholder='Username' className="input-field mb-10 w-80 rounded-md" />
          <input type="password" placeholder='Password' className="input-field mb-10 w-80 rounded-md" />
          <input type="text" placeholder='Slot' className="input-field mb-10 w-80 rounded-md" />
          <button type="submit" className="btn-primary mb-10 bg-blue-800 w-44 rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};



export default LoginPage;

