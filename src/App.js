import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import PostProperty from './PostProperty';
import MyProperties from './MyProperties';
import UpdateProperty from './UpdateProperty';
import Properties from './Properties';
import Favorites from './Favorites';
import Navbar from './Navbar';
import './App.css'; // Import the CSS file for global styles

function App() {
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user_type', { withCredentials: true });
        if (response.data.success) {
          setUserType(response.data.type);
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };

    fetchUserType();
  }, []);

  return (
    <Router>
      {userType && <Navbar userType={userType} />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post-property" element={<PostProperty />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/update_property/:id" element={<UpdateProperty />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
