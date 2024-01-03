// import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage, LoginPage } from './components';
import CalculatorPage from './components/Calculator/CalculatorPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
