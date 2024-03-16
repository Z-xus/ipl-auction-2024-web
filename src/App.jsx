import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from './components/Admin/AdminHome'
import './App.css'
import LoginPage from './components/LoginPage/LoginPage'
import DashboardPage from './components/DashboardPage/DashboardPage'
import CalculatorPage from './components/CalculatorPage/CalculatorPage'
import LeaderboardPage from './components/LeaderboardPage/LeaderboardPage'
import SpectatePage from './components/SpectatePage/SpectatePage'
import CalculatorTestPage from './components/CalculatorPage/CalculatorTestPage'
import CalculatorTestPage2 from './components/CalculatorPage/CalculatorTestPage2'

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
)
