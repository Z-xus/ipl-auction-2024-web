import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, DashboardPage, CalculatorPage, LeaderboardPage, SpectatePage, AdminHome } from './components';
import { CalculatorTestPage, CalculatorTestPage2 } from './components';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/testulator' element={<CalculatorTestPage />} />
        <Route path='/tes2lator' element={<CalculatorTestPage2 />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='/spectate/:teamName' element={<SpectatePage />} />
        <Route path='/admin' element={<AdminHome />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
