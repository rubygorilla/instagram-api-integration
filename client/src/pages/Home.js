// client/pages/index.js
import React from 'react';
import Lottie from 'lottie-react';
import waveAnimation from '../assets/Animation.json';

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
    <div style={styles.container}>
      {/* Floating Header */}
      <div style={styles.header}>
        <h2 style={styles.headerText}>Instagram Integration Project</h2>
        <p style={styles.credit}>Project developed by - Aakash Pardeshi</p>
      </div>

      {/* Animated Title and Lottie Animation */}
      <div style={styles.content}>
        <h1 style={styles.title}>📊 Instagram Insights Dashboard</h1>
        <Lottie animationData={waveAnimation} style={styles.lottie} />
      </div>

      {/* Login Button */}
      <button onClick={handleLogin} style={styles.button}>
        Login with Instagram
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '20px',
  },
  header: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: '#fff',
    textAlign: 'left',
  },
  headerText: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  credit: {
    margin: 0,
    fontSize: '1rem',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    animation: 'fadeIn 2s ease-in-out',
    marginBottom: '20px',
  },
  lottie: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 'auto',
    zIndex: -1,
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.2rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#fff',
    color: '#764ba2',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
};