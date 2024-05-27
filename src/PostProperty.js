import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const PostProperty = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [hospitalsNearby, setHospitalsNearby] = useState('');
  const [collegesNearby, setCollegesNearby] = useState('');
  const navigate = useNavigate();

  const handlePostProperty = async () => {
    try {
      const response = await axios.post('http://localhost:5000/post_property', {
        title,
        description,
        bedrooms,
        bathrooms,
        hospitals_nearby: hospitalsNearby,
        colleges_nearby: collegesNearby,
      });
      if (response.data.success) {
        alert('Property posted successfully');
        navigate('/my-properties');
      } else {
        alert('Failed to post property');
      }
    } catch (error) {
      alert('Error posting property');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Post Property</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="auth-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="auth-input"
        />
        <input
          type="text"
          placeholder="Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="auth-input"
        />
        <input
          type="text"
          placeholder="Bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className="auth-input"
        />
        <input
          type="text"
          placeholder="Hospitals Nearby"
          value={hospitalsNearby}
          onChange={(e) => setHospitalsNearby(e.target.value)}
          className="auth-input"
        />
        <input
          type="text"
          placeholder="Colleges Nearby"
          value={collegesNearby}
          onChange={(e) => setCollegesNearby(e.target.value)}
          className="auth-input"
        />
        <button onClick={handlePostProperty} className="auth-button">Post Property</button>
      </div>
    </div>
  );
};

export default PostProperty;
