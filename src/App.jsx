import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, DashboardPage, CalculatorPage, LeaderboardPage, SpectatePage, AdminPage } from './components';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='/spectate/:teamName' element={<SpectatePage />} />
        <Route path='/admin' element={<AdminPage />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
