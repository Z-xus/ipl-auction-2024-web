import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHome from './components/Admin/AdminHome'
import AddPlayer from './components/Admin/AddPlayer'
import DeletePlayer from './components/Admin/DeletePlayer'
import ManagePowercard from './components/Admin/ManagePowercard';
import AllocateTeam from './components/Admin/AllocateTeam'
import { DashboardPage, LoginPage, LeaderboardPage, CalculatorPage, CalculatorTestPage, SpectatePage } from './components';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/testulator' element={<CalculatorTestPage />} />
        <Route path='/leaderboard' element={<LeaderboardPage />} />
        <Route path='/spectate/:teamName' element={<SpectatePage />} />

        <Route path='/admin' element={<AdminHome />} />
        <Route path="/admin/add-player" element={<AddPlayer />} />
        <Route path="/admin/delete-player" element={<DeletePlayer />} />
        <Route path="/admin/manage-powercard" element={<ManagePowercard />} />
        <Route path="/admin/allocate-team" element={<AllocateTeam />} />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
