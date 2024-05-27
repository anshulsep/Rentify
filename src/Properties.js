import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/properties');
        if (response.data.success) {
          setProperties(response.data.properties);
        } else {
          alert('Failed to fetch properties');
        }
      } catch (error) {
        alert('Error fetching properties');
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get('http://localhost:5000/favorites');
        if (response.data.success) {
          setFavorites(new Set(response.data.favorites.map(fav => fav.id)));
        } else {
          alert('Failed to fetch favorite properties');
        }
      } catch (error) {
        alert('Error fetching favorite properties');
      }
    };

    fetchProperties();
    fetchFavorites();
  }, []);

  const handleFavorite = async (propertyId) => {
    try {
      const response = await axios.post('http://localhost:5000/favorite_property', { property_id: propertyId });
      if (response.data.success) {
        setFavorites(new Set([...favorites, propertyId]));
      } else {
        alert('Failed to favorite property');
      }
    } catch (error) {
      alert('Error favoriting property');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>All Properties</h2>
        {properties.length > 0 ? (
          properties.map(property => (
            <div key={property.id} className="property-card">
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Bathrooms: {property.bathrooms}</p>
              <p>Hospitals Nearby: {property.hospitals_nearby}</p>
              <p>Colleges Nearby: {property.colleges_nearby}</p>
              <button
                onClick={() => handleFavorite(property.id)}
                className="auth-button"
                disabled={favorites.has(property.id)}
              >
                {favorites.has(property.id) ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          ))
        ) : (
          <p>No properties found</p>
        )}
      </div>
    </div>
  );
};

export default Properties;
