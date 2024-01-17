import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage, LoginPage, Calculator, SpectatePage } from './components';
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<Calculator />} />
        <Route path='/spectate/:teamName' element={<SpectatePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)