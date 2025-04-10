// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  useEffect(() => {
    // This will be implemented later when backend is ready
    setLoading(false);
  }, [token]);
  
  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  
  return (
    <div>
      <h2>Profile Page</h2>
      <p>This page will display Instagram profile information and media.</p>
    </div>
  );
};

export default Profile;