import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage, LoginPage, CalculatorPage, SpectatePage } from './components';
import LeaderBoard from './components/LeaderBoard/leaderboard';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/leaderboard' element={<LeaderBoard />} />
        <Route path='/spectate/:teamName' element={<SpectatePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)