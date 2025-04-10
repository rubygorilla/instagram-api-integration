// src/pages/Home.js
import React from 'react';

const Home = () => {
  const handleInstagramLogin = () => {
    window.location.href = 'http://localhost:5000/auth/instagram';
  };

  return (
    <div className="text-center">
      <h1 className="mb-4">Welcome to Instagram Integration</h1>
      <p className="lead mb-4">Connect with your Instagram account to view your profile and media</p>
      <button 
        className="btn btn-primary btn-lg"
        onClick={handleInstagramLogin}
      >
        Login with Instagram
      </button>
    </div>
  );
};

export default Home;
