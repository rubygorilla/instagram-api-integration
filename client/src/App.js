// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import StoreProfile from './pages/storeProfile'; // ⬅️ Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* No container */}
        <Route
          path="/profile"
          element={
            <div className="container mt-4">
              <Profile />
            </div>
          }
        />
        <Route
          path="/storeProfile"
          element={
            <div className="container mt-4">
              <StoreProfile />
            </div>
          }
        />
        <Route
          path="/storeProfile/*"
          element={
            <div className="container mt-4">
              <StoreProfile />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
