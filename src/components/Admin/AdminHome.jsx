import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'; 

const Home = () => {
  return (
    <nav className="home-container">
        <ul>
            <li>
              <Link to="/admin/add-player">Add Player</Link>
            </li>
            <li>
              <Link to="/admin/delete-player">Delete Player</Link>
            </li>
            <li>
              <Link to="/admin/manage-powercard">Manage Powercard</Link>
            </li>
           
            <li>
              <Link to="/admin/allocate-team">Allocate Team</Link>
            </li>
        </ul>
    </nav>
  )
}

export default Home