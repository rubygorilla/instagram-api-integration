// client/pages/index.js
import React from 'react';

export default function Home() {
  const handleLogin = () => {
    const clientId = "1359354858675859";
    const redirectUri = "https://iaibackend.vercel.app/api/auth/callback";

    const scope = [
      "instagram_basic",
      "instagram_manage_insights",
      "pages_show_list",
      "instagram_manage_comments",
      "business_management",
    ].join(",");

    const loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

    window.location.href = loginUrl;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        fontFamily: 'Segoe UI, sans-serif',
        padding: 20,
        textAlign: 'center',
      }}
    >
      {/* Header */}
      <header style={{ position: 'absolute', top: 20, left: 20 }}>
        <h3 style={{ margin: 0 }}>💡 Instagram Integration Project</h3>
        <p style={{ margin: 0, fontSize: 14 }}>Project developed by - <strong>Aakash</strong></p>
      </header>

      {/* Main Title */}
      <h1 style={{ fontSize: '3rem', marginBottom: 20 }}>
        📊 Instagram Insights Dashboard
      </h1>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        style={{
          padding: '12px 24px',
          fontSize: '1.1rem',
          backgroundColor: 'white',
          color: '#764ba2',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        Login with Instagram
      </button>
    </div>
  );
}