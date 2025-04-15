// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import StoreProfile from './pages/storeProfile'; // ⬅️ Add this import
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store-profile" element={<StoreProfile />} />
          <Route path="/store-profile/*" element={<StoreProfile />} /> {/* 👈 Optional catch-all for #_=_ */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
