
import React from 'react';
import Lottie from 'lottie-react';
import waveAnimation from '../assets/Animation.json';
import Image from 'next/image';

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
    <div style={styles.outerContainer}>
      <div style={styles.cardContainer}>
        {/* Story Side */}
        <div style={styles.storySide}>
          <Image src="src/assets/pexels-photo-122383_1.jpeg" alt="Story" width={300} height={500} style={styles.storyImage} />
          <div style={styles.storyCaption}>
            <p style={styles.storyText}>Welcome to my World!</p>
            <div style={styles.profileRow}>
              <Image src="/profile-pic.jpgsrc/assets/pexels-photo-122383_2.jpeg" alt="Annette Black" width={30} height={30} style={styles.avatar} />
              <span style={styles.username}>Annette Black</span>
            </div>
          </div>
        </div>

        {/* Login Side */}
        <div style={styles.loginSide}>
          <h1 style={styles.igTitle}>Instagram</h1>
          <div style={styles.checkmarkCircle}>✔</div>
          <h2 style={styles.successText}>Login Success</h2>
          <p style={styles.redirectText}>Redirecting...</p>
          <button onClick={handleLogin} style={styles.loginButton}>Login with Instagram</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
  },
  cardContainer: {
    display: 'flex',
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    maxWidth: '900px',
    width: '100%',
  },
  storySide: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  storyCaption: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: 'white',
  },
  storyText: {
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '5px',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    borderRadius: '50%',
  },
  username: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  loginSide: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  igTitle: {
    fontSize: '2rem',
    fontFamily: 'cursive',
    marginBottom: '20px',
  },
  checkmarkCircle: {
    fontSize: '3rem',
    color: '#fd1d1d',
    border: '3px solid #fd1d1d',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    textAlign: 'center',
    lineHeight: '60px',
    marginBottom: '10px',
  },
  successText: {
    color: '#833ab4',
    fontSize: '1.5rem',
  },
  redirectText: {
    fontSize: '0.9rem',
    color: '#999',
    marginBottom: '20px',
  },
  loginButton: {
    padding: '12px 20px',
    fontSize: '1rem',
    background: '#fcb045',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }
};