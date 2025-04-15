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
    <div style={styles.container}>
      {/* Top Left Header */}
      <div style={styles.header}>
        <h2 style={styles.headerText}>Instagram Integration Project</h2>
        <p style={styles.credit}>Project developed by - Aakash Pardeshi</p>
      </div>

      {/* Center Content */}
      <div style={styles.centerContent}>
        <h1 style={styles.title}>
          📊 Instagram Insights Dashboard
        </h1>
        <button onClick={handleLogin} style={styles.button}>
          Login with Instagram
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)', // Instagram-like gradient
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: '20px',
    left: '30px',
    color: 'white',
  },
  headerText: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '600',
  },
  credit: {
    margin: 0,
    fontSize: '0.9rem',
  },
  centerContent: {
    margin: 'auto',
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  button: {
    padding: '15px 25px',
    fontSize: '1.1rem',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#dd2a7b',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  }
};

// Add this CSS somewhere in your global CSS (like styles/globals.css)
const globalCSS = `
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = globalCSS;
  document.head.appendChild(style);
}
