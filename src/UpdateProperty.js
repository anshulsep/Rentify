import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Auth.css';

const UpdateProperty = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [hospitalsNearby, setHospitalsNearby] = useState('');
  const [collegesNearby, setCollegesNearby] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/property/${id}`);
        if (response.data.success) {
          const property = response.data.property;
          setTitle(property.title);
          setDescription(property.description);
          setBedrooms(property.bedrooms);
          setBathrooms(property.bathrooms);
          setHospitalsNearby(property.hospitals_nearby);
          setCollegesNearby(property.colleges_nearby);
        } else {
          alert('Failed to fetch property');
        }
      } catch (error) {
        alert('Error fetching property');
      }
    };

    fetchProperty();
  }, [id]);

  const handleUpdateProperty = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/update_property/${id}`, {
        title,
        description,
        bedrooms,
        bathrooms,
        hospitals_nearby: hospitalsNearby,
        colleges_nearby: collegesNearby
      });
      if (response.data.success) {
        alert('Property updated successfully');
        navigate('/my-properties');
      } else {
        alert('Failed to update property');
      }
    } catch (error) {
      alert('Error updating property');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Update Property</h2>
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
        <button onClick={handleUpdateProperty} className="auth-button">Update Property</button>
      </div>
    </div>
  );
};

export default UpdateProperty;
