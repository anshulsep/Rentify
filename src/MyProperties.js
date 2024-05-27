import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Auth.css';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/my_properties');
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          alert('Failed to fetch properties');
        }
      } catch (error) {
        alert('Error fetching properties');
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete_property/${propertyId}`);
      if (response.data.success) {
        setProperties(properties.filter(property => property.id !== propertyId));
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      alert('Error deleting property');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>My Properties</h2>
        {properties.length > 0 ? (
          properties.map(property => (
            <div key={property.id} className="property-card">
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Bathrooms: {property.bathrooms}</p>
              <p>Hospitals Nearby: {property.hospitals_nearby}</p>
              <p>Colleges Nearby: {property.colleges_nearby}</p>
              <button onClick={() => handleDelete(property.id)} className="auth-button">Delete</button>
              <Link to={`/update_property/${property.id}`} className="auth-button">Update</Link>
            </div>
          ))
        ) : (
          <p>No properties found</p>
        )}
        <Link to="/post-property" className="auth-button">Post New Property</Link>
      </div>
    </div>
  );
};

export default MyProperties;
