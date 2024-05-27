import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5000/favorites');
        if (response.data.success) {
          setFavorites(response.data.favorites);
        } else {
          alert('Failed to fetch favorite properties');
        }
      } catch (error) {
        alert('Error fetching favorite properties');
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>My Favorites</h2>
        {favorites.length > 0 ? (
          favorites.map(property => (
            <div key={property.id} className="property-card">
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Bathrooms: {property.bathrooms}</p>
              <p>Hospitals Nearby: {property.hospitals_nearby}</p>
              <p>Colleges Nearby: {property.colleges_nearby}</p>
            </div>
          ))
        ) : (
          <p>No favorite properties found</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
