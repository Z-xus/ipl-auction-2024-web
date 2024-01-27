import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage, LoginPage, LeaderboardPage, CalculatorPage, SpectatePage } from './components';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='/spectate/:teamName' element={<SpectatePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)