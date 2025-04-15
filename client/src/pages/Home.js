import React from 'react';

export default function Home() {
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_FB_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
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
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* Floating Header */}
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
    </div>
  );
}

const styles = {
  pageWrapper: {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
  },
  container: {
    height: '100%',
    width: '100%',
    background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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

// Global gradient animation
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
