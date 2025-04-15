import React, { useState } from 'react';
import Lottie from 'lottie-react';
import waveAnimation from '../assets/Animation.json';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false); // Simulate login

  const handleLogin = () => {
    // This would be replaced with real OAuth redirection
    // For now, just simulate login success
    setLoggedIn(true);

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
    // window.location.href = loginUrl;
  };

  return (
    <div style={styles.container}>
      {!loggedIn ? (
        <>
          {/* Floating Header */}
          <div style={styles.header}>
            <h2 style={styles.headerText}>Instagram Integration Project</h2>
            <p style={styles.credit}>Project developed by - Aakash Pardeshi</p>
          </div>

          {/* Animated Title and Lottie Animation */}
          <div style={styles.content}>
            <h1 style={styles.title}>📊 Instagram Insights Dashboard</h1>
            <Lottie animationData={waveAnimation} style={styles.lottie} loop={true} />
          </div>

          {/* Login Button */}
          <button onClick={handleLogin} style={styles.button}>
            Login with Instagram
          </button>
        </>
      ) : (
        <div style={styles.successWrapper}>
          {/* Left - Instagram style media */}
          <div style={styles.storyCard}>
            <img
              src="https://images.unsplash.com/photo-1580136501460-71c1cf8a3a35?auto=format&fit=crop&w=800&q=80"
              alt="Homeless story"
              style={styles.storyImage}
            />
            <div style={styles.storyOverlay}>
              <p style={{ fontWeight: '600', marginBottom: 8 }}>
                The struggle of the homeless to survive amid the pandemic
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Annette"
                  style={{ width: 30, height: 30, borderRadius: '50%' }}
                />
                <span>@annette</span>
              </div>
            </div>
          </div>

          {/* Right - Login Success */}
          <div style={styles.successCard}>
            <h1 style={styles.igHeading}>Instagram</h1>
            <div style={styles.checkCircle}>
              <svg
                style={{ width: 40, height: 40, color: '#d6249f' }}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p style={styles.successText}>Login Success</p>
            <p style={styles.redirecting}>Redirecting...</p>

            <div style={styles.fbBar}>
              Facebook Connected
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
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
    color: '#cc2366',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  successWrapper: {
    display: 'flex',
    width: '100%',
    maxWidth: 1000,
    borderRadius: 30,
    backgroundColor: '#fff',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  storyCard: {
    width: '50%',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 20,
    color: '#fff',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    width: '100%',
  },
  successCard: {
    width: '50%',
    padding: '40px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  igHeading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    border: '4px solid #e1306c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  successText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e1306c',
  },
  redirecting: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: 30,
  },
  fbBar: {
    background: 'linear-gradient(to right, #4c68d7, #8e44ad)',
    padding: 12,
    borderRadius: 12,
    color: '#fff',
    fontWeight: '500',
  }
};
