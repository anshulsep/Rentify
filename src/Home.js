import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user_type');
        if (response.data.success) {
          setUserType(response.data.type);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUserType();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome to the Home Screen</h2>
        <button onClick={handleLogout} className="auth-button">Logout</button>
        {userType === 'seller' && (
          <div>
            <button onClick={() => navigate('/post-property')} className="auth-button">Post New Property</button>
            <button onClick={() => navigate('/my-properties')} className="auth-button">View My Properties</button>
          </div>
        )}
        {userType === 'buyer' && (
          <div>
            <button onClick={() => navigate('/properties')} className="auth-button">View All Properties</button>
            <button onClick={() => navigate('/favorites')} className="auth-button">View My Favorites</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
