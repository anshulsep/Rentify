import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css'; // Create a CSS file for styling

const Navbar = ({ userType }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <h1>Rentify</h1>
      <div className="nav-links">
        <Link to="/home">Home</Link>
        {userType === 'seller' && (
          <>
            <Link to="/post-property">Post Property</Link>
            <Link to="/my-properties">My Properties</Link>
          </>
        )}
        {userType === 'buyer' && (
          <>
            <Link to="/properties">Properties</Link>
            <Link to="/favorites">Favorites</Link>
          </>
        )}
        <button onClick={handleLogout} className="nav-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
